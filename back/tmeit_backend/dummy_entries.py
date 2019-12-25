from tmeit_backend import models

# Some example values for the database for development stuff

# Dummy workteam entry
TEST_TEAM_NAME = "Web Crew"
TEST_SYMBOL = "W"
TEST_ACTIVE = True
TEST_ACTIVE_YEAR = 2019
TEST_ACTIVE_PERIOD = models.PeriodEnum.spring

# Dummy member entry
TEST_EMAIL = "testtmeit@gmail.com"
TEST_PASSWORD_HASH = "ABC"
TEST_FIRST_NAME = "Test"
TEST_NICKNAME = "TT"
TEST_LAST_NAME = "TMEIT"
TEST_PHONE = "(555) 555-5555"
TEST_DRIVERS_LICENSE = True
TEST_STAD = True
TEST_FEST = False
TEST_LIQUOR_PERMIT = False
TEST_CURRENT_ROLE = models.CurrentRoleEnum.marshal
