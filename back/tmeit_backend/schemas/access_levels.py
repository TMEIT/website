from enum import IntEnum


class APIAccessLevelsEnum(IntEnum):
    """Permission to edit or read fields on an API schema"""
    edit = 2
    read = 1
    denied = 0
