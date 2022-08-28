# script to generate python code from password list

with open("10-million-password-list-top-1000000.txt") as pw_file, open("_owasp_common_passwords.py", "w") as output:
    output.write('passwords = "')
    for pw in pw_file:
        output.write(f'{pw.strip()} ')
    output.write('"\n')
