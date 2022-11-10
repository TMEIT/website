from back.tmeit_backend.worker_tasks._tmeit_logo import tmeit_logo

email_header = (
            '<!DOCTYPE html>'
            '<html lang="en">'
            '<head>'
                '<meta charset="UTF-8">'
            '</head>'
            '<body style="display: grid; place-items: center; background: #44687d; font-family: sans-serif; color: white;" >'
            f'<img src="{tmeit_logo}" style="height: 10em;" alt="TMEIT logo" />'
)