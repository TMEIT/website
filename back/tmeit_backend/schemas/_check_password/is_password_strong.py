from ._owasp_common_passwords import passwords


def is_password_strong(pw: str) -> None:
    """
    Checks if a password has at least 6 characters and isn't very common. Raises a ValueError if the password isn't good enough.

    We check the password against OWASP's 1M most common passwords list.

    We use a very naiive algorithm to search the password list, and it uses 100MiB to run the search, but I'm not writing a tree algorithm for this lol.
    It runs really fast anyways, it just wastes a lot of memory building the hashmap, which gets freed after this function exits.
    There's also a 10M password list we could search, but we would need a better algorithm to make it use less memory, since 1GiB is not free.
    """

    if len(pw) < 6:
        raise ValueError("Password must be at least 6 characters long")

    pw_set = {p for p in passwords.split(" ")}  # Use a Set (aka hashmap) for fast searches
    if pw in pw_set:
        raise ValueError(f'"{pw}" is a bad password."'
                         ' I found it here: https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-100000.txt')
