# db_init.py
# initialize a new database from scratch for development

import app

# create database
app.db.create_all()

# add entries
alpha = app.Workteam(name="Alpha", symbol="α", active=True, active_year=3005, active_period="spring")
app.db.session.add(alpha)
beta = app.Workteam(name="Beta", symbol="🅱️", active=False, active_year=1998)
app.db.session.add(beta)

app.db.session.add_all([
    app.Member(email="alex@information.wtf", first_name="Alex", last_name="Jones", role="master", workteams=[alpha],
               liquor_permit=False),
    app.Member(email="ahnold@chopper.ca", first_name="Arnold", last_name="Austrian", role="vraq",
               workteams=[alpha, beta], liquor_permit=False),
    app.Member(email="bob@bob.blog", first_name="Bob", last_name="Bob", role="marshal", workteams=[beta],
               liquor_permit=False),
    app.Member(email="guy@dude.brother", first_name="Pal", last_name="Buddy", nickname="James", phone="555-5555",
               drivers_license=False, stad=False, fest=True, liquor_permit=True, role="pajas",
               titles="That guy 2020,Cool Guy everyday")
])

app.db.session.commit()
