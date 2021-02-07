#!/usr/bin/python
"""
Imports all cleaningstages for all the different cleaning
processes.
"""
import collections
import sys

from pprint import pprint

from .fixture_clean import fixture_player_stats
from .fixture_clean import fixturestats
from .fixture_clean import fixtureinfo
from .league_standings_clean import league_standings
from .player_clean import playerstats
from .team_squads_clean import team_squads
from .team_standings_clean import team_standings



if __name__ == '__main__':
    pprint(fixtureinfo('EN_PR', '2020'))



