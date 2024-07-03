"""
Custom implementation of web client class:
- manage excluded sitemaps
- manage robots.txt
"""

from http import HTTPStatus
from typing import Optional, Dict
from urllib.robotparser import RobotFileParser

import requests

from usp.web_client.abstract_client import (
    AbstractWebClient,
    AbstractWebClientResponse,
    AbstractWebClientSuccessResponse,
    WebClientErrorResponse,
    RETRYABLE_HTTP_STATUS_CODES,
)
from usp.__about__ import __version__

"""
Below we disable the parsing of the "non-robots" sitemap, that ultimate-sitemap-parser does by default (and can't be disabled by config :-()
"""
NON_ROBOTS_SITEMAPS = [
    "sitemap.xml",
    "sitemap.xml.gz",
    "sitemap_index.xml",
    "sitemap-index.xml",
    "sitemap_index.xml.gz",
    "sitemap-index.xml.gz",
    ".sitemap.xml",
    "sitemap",
    "admin/config/search/xmlsitemap",
    "sitemap/sitemap-index.xml",
    "sitemap_news.xml",
    "sitemap-news.xml",
    "sitemap_news.xml.gz",
    "sitemap-news.xml.gz",
]


class RequestsWebClientSuccessResponse(AbstractWebClientSuccessResponse):
    """
    requests-based successful response.
    """

    __slots__ = [
        "__requests_response",
        "__max_response_data_length",
    ]

    def __init__(
        self,
        requests_response: requests.Response,
        max_response_data_length: Optional[int] = None,
    ):
        self.__requests_response = requests_response
        self.__max_response_data_length = max_response_data_length

    def status_code(self) -> int:
        return int(self.__requests_response.status_code)

    def status_message(self) -> str:
        message = self.__requests_response.reason
        if not message:
            message = HTTPStatus(self.status_code(), None).phrase
        return message

    def header(self, case_insensitive_name: str) -> Optional[str]:
        return self.__requests_response.headers.get(case_insensitive_name.lower(), None)

    def raw_data(self) -> bytes:
        if self.__max_response_data_length:
            data = self.__requests_response.content[: self.__max_response_data_length]
        else:
            data = self.__requests_response.content

        return data


class RequestsWebClientErrorResponse(WebClientErrorResponse):
    """
    requests-based error response.
    """

    pass


class RequestsCustomWebClient(AbstractWebClient):
    """requests-based web client to be used by the sitemap fetcher."""

    __USER_AGENT = "ultimate_sitemap_parser/{}".format(__version__)

    __HTTP_REQUEST_TIMEOUT = 10
    """
    HTTP request timeout.

    Some webservers might be generating huge sitemaps on the fly, so this is why it's rather big.
    """

    __slots__ = [
        "__max_response_data_length",
        "__timeout",
        "__proxies",
    ]

    def __init__(
        self, base_host: str, excluded_sitemap_urls: set[str], robots: RobotFileParser
    ):
        self.__max_response_data_length = None
        self.__timeout = self.__HTTP_REQUEST_TIMEOUT
        self.__proxies = {}
        self.__base_host = base_host.strip("/")
        self.__excluded_sitemap_urls = (
            excluded_sitemap_urls if excluded_sitemap_urls else set()
        )
        self.__robots = robots
        # Compute the sitemaps that should not be parsed (i.e. were in the NON_ROBOTS_SITEMAP above, and not in the robots.txt)
        self.__disabled_non_robots_sitemaps = (
            NON_ROBOTS_SITEMAPS
            if not robots.site_maps()
            else list(
                set(NON_ROBOTS_SITEMAPS).difference(set(self.__robots.site_maps()))
            )
        )
        # We keep track of the urls that had errors, so that we can NOT add them to the excluded ones
        self.__urls_with_errors = []

    def set_timeout(self, timeout: int) -> None:
        """Set HTTP request timeout."""
        # Used mostly for testing
        self.__timeout = timeout

    def set_proxies(self, proxies: Dict[str, str]) -> None:
        """
        Set proxies from dictionnary where:

        * keys are schemes, e.g. "http" or "https";
        * values are "scheme://user:password@host:port/".

        For example:

            proxies = {'http': 'http://user:pass@10.10.1.10:3128/'}
        """
        # Used mostly for testing
        self.__proxies = proxies

    def set_max_response_data_length(self, max_response_data_length: int) -> None:
        self.__max_response_data_length = max_response_data_length

    def get_urls_with_errors(self) -> list[str]:
        return self.__urls_with_errors

    def get(self, url: str) -> AbstractWebClientResponse:
        if url in [
            f"{self.__base_host}/{path}" for path in self.__disabled_non_robots_sitemaps
        ]:
            message = f"skipping sitemap not declared in robots: {url}"
            print(message)
            return RequestsWebClientErrorResponse(message=message, retryable=False)
        if url in self.__excluded_sitemap_urls:
            message = f"skipping excluded sitemap URL: {url}"
            print(message)
            return RequestsWebClientErrorResponse(message=message, retryable=False)

        try:
            response = requests.get(
                url,
                timeout=self.__timeout,
                stream=True,
                headers={"User-Agent": self.__USER_AGENT},
                proxies=self.__proxies,
            )
            # print(response.content)
        except requests.exceptions.Timeout as ex:
            self.__urls_with_errors.append(url)
            # Retryable timeouts
            return RequestsWebClientErrorResponse(message=str(ex), retryable=True)

        except requests.exceptions.RequestException as ex:
            # Other errors, e.g. redirect loops
            return RequestsWebClientErrorResponse(message=str(ex), retryable=False)

        else:
            if 200 <= response.status_code < 300:
                return RequestsWebClientSuccessResponse(
                    requests_response=response,
                    max_response_data_length=self.__max_response_data_length,
                )
            else:
                message = "{} {}".format(response.status_code, response.reason)

                if response.status_code in RETRYABLE_HTTP_STATUS_CODES:
                    self.__urls_with_errors.append(url)
                    return RequestsWebClientErrorResponse(
                        message=message, retryable=True
                    )
                else:
                    return RequestsWebClientErrorResponse(
                        message=message, retryable=False
                    )
