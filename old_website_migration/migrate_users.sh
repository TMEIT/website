podman build -f old_website_migration/Containerfile -t migrate_users .
podman run --rm --network=host migrate_users


# notes
#  podman run -p 3306 -v ~/Downloads/TMEIT.se\ Database.sql:/dbdump.sql:Z -d --name=mariadb -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=true mariadb
#  podman exec -it mariadb mysql --execute="CREATE DATABASE tmeit;"
#  podman exec -it mariadb bash -c 'mysql tmeit < /dbdump.sql'
#  podman exec -it mariadb mysql

# use tmeit;
# show tables;
# select * from information_schema.columns  where table_name = "tmeit_users";

# Nickname is inside ""
# assume all tokens but last are the first name, assume the last token is the last name

#MariaDB [tmeit]> select * from tmeit_titles;
#+----+------------------------+---------------+----------+
#| id | title                  | email         | sort_idx |
#+----+------------------------+---------------+----------+
#|  1 | TraditionsM�stare      | tm@tmeit.se   |        1 |
#|  2 | Vice TraditionsM�stare | vtm@tmeit.se  |        2 |
#|  4 | SkattM�stare           | eko@tmeit.se  |        3 |
#|  5 | PubM�stare             | pub@tmeit.se  |        4 |
#|  6 | SkriptM�stare          | sekr@tmeit.se |        5 |
#|  7 | GourmetPrao            |               |        0 |
#|  8 | JunkPrao               |               |        0 |
#|  9 | WebbWraq               |               |        0 |
#| 10 | GourmetMarskalk        |               |        0 |
#| 11 | JunkMarskalk           |               |        0 |
#| 12 | WebbPrao               |               |        0 |
#| 15 | JunkVraq               |               |        0 |
#| 16 | WebbMarskalk           |               |        0 |
#+----+------------------------+---------------+----------+

# CURRENT ROLE IS user.group_id!!
#  MariaDB [tmeit]> select * from tmeit_groups;
#  +----+----------+----------+-------------+
#  | id | title    | sort_idx | is_inactive |
#  +----+----------+----------+-------------+
#  |  1 | Marskalk |        2 |           0 |
#  |  2 | Vraq     |        4 |           0 |
#  |  3 | M�stare  |        0 |           0 |
#  |  4 | Prao     |        3 |           0 |
#  |  5 | Ex       |        6 |           1 |
#  |  7 | Inaktiva |        5 |           1 |
#  |  8 | Pajas    |        1 |           0 |
#  +----+----------+----------+-------------+

