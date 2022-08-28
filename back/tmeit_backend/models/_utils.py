from sqlalchemy import String
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.expression import cast
from sqlalchemy.sql.functions import FunctionElement, func


class short_uuid_from_uuid(FunctionElement):
    """
    SQL function that converts a postgres UUID into an 8-char base64url string containing the first 48 bits.

    Used for creating a functional index that allows for fast model lookups from a url using the "short_uuid"
    """
    pass


@compiles(short_uuid_from_uuid)
def compile_short_uuid_from_uuid(element, compiler, **kw):
    arg1, = list(element.clauses)
    uuid_to_string = cast(arg1, String)
    remove_hyphens = func.replace(uuid_to_string, '-', '')
    truncate = func.left(remove_hyphens, 12)
    convert_to_binary = func.decode(truncate, 'hex')
    convert_to_base64 = func.encode(convert_to_binary, 'base64')
    hyphens = func.replace(convert_to_base64, '+', '-')
    underscores = func.replace(hyphens, '/', '_')
    return compiler.process(underscores, **kw)
