import ipaddress
from typing import Union


def convert_to_ipv6(ip: Union[ipaddress.IPv4Address, ipaddress.IPv6Address]) -> str:
    """
    Makes sure that the IP address is in IPv6 format and returns the text format of that IP address.

    If the IP address is an IPv4 address, this function converts it into an IPv4-Mapped IPv6 Address.

    Raises a ValueError if the input is not an IP address.
    """
    match ip:
        case ipaddress.IPv6Address():
            return str(ip)
        case ipaddress.IPv4Address():  # Convert IPv4 address to an IPv4-Mapped IPv6 Address
            ip_bytes = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff' + ip.packed
            return str(ipaddress.IPv6Address(ip_bytes))
        case _:
            raise ValueError("Invalid IP address!")