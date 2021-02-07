import clean_stats.clean_stats as clean
from get_data.get_stats import SeasonStats
from database import mongo_db as db

"""
INSTUCTIONS

If a new type of file that is supposed to be pushed to db
then all it's functions should be added under a common key in
-- CLEAN_LOADING_CHOICES
-- DB_PUSH_CHOICES
-- FILE_NAMES
"""

CLEAN_LOADING_CHOICES = {
    '-p': clean.playerstats,
    '-t': clean.team_standings,
    '-f': clean.fixturestats,
    '-i': clean.fixtureinfo,
    '-l': clean.league_standings,
    '-e': clean.fixture_player_stats,
    '-s': clean.team_squads
}

DB_PUSH_CHOICES = {
    '-p': db.executePushPlayerLeague,
    '-t': db.executePushTeamLeague,
    '-f': db.executePushFixtureStatsLeague,
    '-i': db.executePushFixtureInfoLeague,
    '-l': db.executePushLeagueStandingsLeague,
    '-e': db.executePushFixturePlayerStatsLeague,
    '-s': db.executePushTeamSquadsLeague
    }

FILE_NAMES = {
    '-p':'playerstats',
    '-t': 'team_standings',
    '-f': 'fixture_stats',
    '-i': 'fixture_info',
    '-l': 'league_standings',
    '-e': 'player_fixture',
    '-s': 'team_squads',
}

def loading_choices(type_stats, league, season, choices=CLEAN_LOADING_CHOICES):
    if type_stats in choices.keys():
        return choices.get(type_stats)(league, season)

def push_choices(type_stats, database, choices=DB_PUSH_CHOICES):
    if type_stats in choices.keys():
        return choices.get(type_stats)(database)

def downloads_choices(type_stats, league, season):
    """Returns an instance of a class that runs a download function
        Args:
            type_stats (str): One of below keys in the dict
            league (str): A league abbreviation, ex. EN_PR
            season (str): A valid season, ex 2019/2020
    """
    stats = SeasonStats()
    choices = {'-p': ['player_stats', league, season],
               '-t': ['team_standings', league, season],
               '-f': ['fixture_stats', league, season],
               '-s': ['team_squad', league, season],
               '-l': ['league_standings', league, season],
               '-i': ['fixture_info', league, season],
               '-e': ['fixture_player_stats', league, season]}
    params = choices.get(type_stats)
    return stats(*params)