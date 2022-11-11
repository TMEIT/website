from ._tmeit_logo import tmeit_logo


email_header = (
            '<!DOCTYPE html>'
            '<html lang="en">'
            '<head>'
                '<meta charset="UTF-8">'
            '</head>'
            '<body style="display: grid; place-items: center; background: #44687d; font-family: sans-serif; color: white;" >'
            # f'<img src="{tmeit_logo}" style="height: 10em;" alt="TMEIT logo" />' # Email clients cant render the SVG
)


def convert_body_to_html(plain_body: str) -> str:
    """Replaces double-linebreaks with <p> tags, and single-linebreaks with <br />"""
    output = ""
    for line in plain_body.split("\n\n"):
        line_with_br = line.replace("\n", "<br />")
        output += f"<p>{line_with_br}</p>"
    return output
