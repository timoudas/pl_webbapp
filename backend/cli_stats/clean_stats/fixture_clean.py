from .load_files import deep_get
from .load_files import load_fixture_info
from .load_files import load_fixture_player_stats
from .load_files import load_fixture_stats
from pprint import pprint

"""
FIX SEASONLABEL/SEASON IS IN FIXTURE_STATS FUNCTION
"""

def read_fixtureinfo(data):
    info_all = []
    try:
        for d in data:
            stats_temp = {}
            teams = []

            if 'info' in d:
                stats = d['info']
                home_team = stats['teams'][0]
                away_team = stats['teams'][1]
                team = {
                    'team' : stats['teams'][0]['team']['name'],
                    'teamId' : stats['teams'][0]['team']['club']['id'],
                    'teamShortName' : stats['teams'][0]['team']['shortName'],
                    'teamScore' : deep_get(home_team, 'score', default=0),
                }
                teams.append(team)
                team = {
                    'team' : stats['teams'][1]['team']['name'],
                    'teamId' : stats['teams'][1]['team']['club']['id'],
                    'teamShortName' : stats['teams'][1]['team']['shortName'],
                    'teamScore' : deep_get(away_team, 'score', default=0),
                }
                teams.append(team)
                stats_temp = \
                    {'gameweek_id' : deep_get(stats, 'gameweek.id'),
                    'seasonLabel' : deep_get(stats, 'gameweek.compSeason.label'),
                    'seasonId' : deep_get(stats, 'gameweek.compSeason.id'),
                    'fId' : stats['id'],

                    'competition' : deep_get(stats, 'gameweek.compSeason.competition.description'),
                    'competitionAbbr' : deep_get(stats, 'gameweek.compSeason.competition.abbreviation'),
                    'competitionId' : deep_get(stats, 'gameweek.compSeason.competition.id'),

                    'gameweek' : deep_get(stats, 'gameweek.gameweek'),
                    'kickoff' : deep_get(stats, 'provisionalKickoff.label'),
                    'kickoffMillis' : deep_get(stats, 'provisionalKickoff.millis'),
                    'kickoffComp': deep_get(stats, 'kickoff.completeness'),
                    'teams': teams,

                    'ground' : deep_get(stats, 'ground.name'),
                    'groundsId' : deep_get(stats, 'ground.id'),

                    'city' : deep_get(stats, 'ground.city'),
                    'fixtureType' : stats.get('fixtureType'),
                    'extraTime' : stats.get('extraTime'),
                    'shootout' : stats.get('shootout'),
                    'status': stats.get('status'),

                    'clockLabel' : deep_get(stats, 'clock.label', default=0),
                    'clockSecs' : deep_get(stats, 'clock.secs', default=0)}
                info_all.append(stats_temp)
    except TypeError:
        print("Check that data exists and is loaded correctly")
    return info_all

def read_fixturestats(data):
    """Returns a json object where each object represents a 
    teams stats for a specific season"""
    try:
        stats_all = []
        for d in data:
            stats_temp = {}
            if not 'stats' in d:
                try:
                    stats_temp['fId'] = deep_get(d, 'info.id')
                    stats_temp['seasonLabel'] = d['info']['gameweek']['compSeason']['label']
                    stats_temp['seasonId'] = deep_get(d, 'info.gameweek.compSeason.id')
                    stats_all.append(stats_temp)
                except KeyError as e:
                    pass
            else:
                stats = d['stats']
                info = d['info']
                home_id_key = str(info['teams'][0]['team']['club']['id'])
                away_id_key = str(info['teams'][1]['team']['club']['id'])
                data_home = {}
                data_away = {}

                if away_id_key in stats:
                    if home_id_key in stats:

                        home = stats[home_id_key]['M']
                        data_home['seasonLabel'] = d['info']['gameweek']['compSeason']['label']
                        data_home['seasonId'] = deep_get(info, 'gameweek.compSeason.id')
                        data_home['fId'] = deep_get(info, 'id')
                        data_home['teamId'] = home_id_key
                        data_home.update({stats.get('name'): stats.get('value') for stats in home})
                        
                        away = stats[away_id_key]['M']
                        data_away['seasonLabel'] = d['info']['gameweek']['compSeason']['label']
                        data_away['seasonId'] = deep_get(info, 'gameweek.compSeason.id')
                        data_away['fId'] = deep_get(info, 'id')
                        data_away['teamId'] = away_id_key
                        data_away.update({stats.get('name'): stats.get('value') for stats in away})

                stats_all.append(data_home)
                stats_all.append(data_away)
        return stats_all
    except TypeError as e:
        print(e, "Check that data exists and is loaded correctly")

def get_match_officials(officials):
    match_officals_temp = \
    {'role': deep_get(officials, 'role'),
        'matchOfficialId': officials['matchOfficialId'],
        'first': deep_get(officials, 'name.first'),
        'last': deep_get(officials, 'name.last'),
        'name': deep_get(officials, 'name.display'),
        'm_id': officials['id']
    }
    return match_officals_temp

def get_events(event):
    events_temp = \
    {'clockSecs': deep_get(event, 'clock.secs'),
        'clockLabel': deep_get(event, 'clock.label'),
        'phase': deep_get(event, 'phase'),
        'type': deep_get(event, 'type'),
        'timeMillis': deep_get(event, 'time.millis'),
        'timeLabel': deep_get(event, 'time.label'),
        'homeScore': deep_get(event, 'score.homeScore'),
        'awayScore': deep_get(event, 'score.awayScore'),
        'id': deep_get(event, 'id'),
    }
    return events_temp

def get_substitutes(sub, team_id):
    substitutes_temp = \
    {'teamId': team_id,
        'matchPosition': deep_get(sub, 'matchPosition'),
        'captain': deep_get(sub, 'captain'),
        'playerId': deep_get(sub, 'playerId'),
        'position': deep_get(sub, 'info.position'),
        'shirtNum': deep_get(sub, 'info.shirtNum'),
        'positionInfo': deep_get(sub, 'info.positionInfo'),
        'name': deep_get(sub, 'name.display'),
        'first': deep_get(sub, 'name.first'),
        'last': deep_get(sub, 'name.last'),
        'id': sub['id']
    }
    return substitutes_temp

def get_lineup(line, team_id):
    lineup_temp = \
        {'teamId': team_id,
        'matchPosition': deep_get(line, 'matchPosition'),
        'captain': deep_get(line, 'captain'),
        'playerId': deep_get(line, 'playerId'),
        'position': deep_get(line, 'info.position'),
        'shirtNum': deep_get(line, 'info.shirtNum'),
        'positionInfo': deep_get(line, 'info.positionInfo'),
        'name': deep_get(line, 'name.display'),
        'first': deep_get(line, 'name.first'),
        'last': deep_get(line, 'name.last'),
        'id': line['id'],
    }
    return lineup_temp

def read_fixture_events(data):
    info_all = []
    for d in data:
        match_officals = d['matchOfficials']
        half_time =d['halfTimeScore']
        team_list = d['teamLists']
        events = d['events']
        stats_temp = \
            { 'homeHalfTimeScore' : half_time['homeScore'],
              'awayHalfTimeScore' : half_time['awayScore'],
              'matchOfficials': [],
              'lineUps': [],
              'substitutes': [],
              'events' : [],
              'fId': d['id'],
              'formation':[],
        }
        for official in match_officals:
            data = get_match_officials(official)
            stats_temp['matchOfficials'].append(data)            

        for lineups in team_list:
            if lineups:
                team_id = lineups['teamId']
                linup = lineups['lineup']
                substitutes = lineups['substitutes']
                formation = deep_get(lineups, 'formation')
                formation_temp = \
                {'teamId': team_id,
                'label': deep_get(formation, 'label'),
                'players': deep_get(formation, 'players')
                }
                stats_temp['formation'].append(formation_temp)
                for line in linup:
                    data = get_lineup(line, team_id)
                    stats_temp['lineUps'].append(data)

                for sub in substitutes:
                    data = get_substitutes(sub, team_id)
                    stats_temp['substitutes'].append(data)

        for event in events:
            if event:
                data = get_events(event)
                stats_temp['events'].append(data)

        info_all.append(stats_temp)
    return info_all

def read_player_fixture_all(data):
    """Read stats from ...playerstats.json into flattened
    list of dicts. 
    """
    try:
        stats_all = []
        for d in data:
            stats_temp = {}
            if 'stats' in d:
                stats = d['stats']
                for dicts in stats:
                    stats_temp['id'] = dicts.get('id')
                    if dicts.get('name') != None:
                        stats_temp[dicts.get('name')] = dicts.get('value')
            if 'info' in d:
                stats = d['info']
                stats_temp.update(
                    {'age' : stats.get('age'),
                    'f_id': stats.get('f_id'),
                    'id' : stats.get('id'),
                    'seasonId' : stats.get('seasonId'),
                    'seasonLabel' : stats.get('seasonLabel'),
                    'birth' : deep_get(stats, 'birth.date.label'),
                    'birth_exact' : deep_get(stats, 'birth.date.millis'),
                    'country' : deep_get(stats, 'birth.country.country'),
                    'isoCode' : deep_get(stats, 'birth.country.isoCode'),
                    'loan' : deep_get(stats, 'info.loan'),
                    'position' : deep_get(stats, 'info.position'),
                    'positionInfo' : deep_get(stats, 'info.positionInfo'),
                    'shirtNum' : deep_get(stats, 'info.shirtNum'),
                    'name' : deep_get(stats, 'name.display'),
                    'first' : deep_get(stats, 'name.first'),
                    'last' : deep_get(stats, 'name.last'),
                    'nationalTeam' : deep_get(stats, 'nationalTeam.country'),
                    'playerId' : stats.get('playerId'),
                    'p_id' : stats.get('id'),})
            stats_all.append(stats_temp)
        return stats_all
    except TypeError as e:
        print("Check that data exists and is loaded correctly")

def fixtureinfo(league, year):
    """Concats fixture info and fixture events and returns a json object
    """
    info = read_fixtureinfo(load_fixture_stats(league, year))
    events = read_fixture_events(load_fixture_info(league, year))

    fixture_merged = [{**x, **y} for y in info for x in events if x['fId'] == y['fId']]
    fixture_merged_sorted = [dict(sorted(d.items())) for d in fixture_merged]
    return fixture_merged_sorted

def fixturestats(league, year):
    """Returns fixture stats in a json object
    """
    stats = read_fixturestats(load_fixture_stats(league, year))
    return stats

def fixture_player_stats(league, year):
    players_info = read_player_fixture_all(load_fixture_player_stats(league, year))
    return players_info