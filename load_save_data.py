import json

from google.cloud import datastore

def get_client():
    return datastore.Client()

def load_key(client, entity_type, entity_id=None, parent_key=None):

    key = None
    if entity_id:
        key = client.key(entity_type, entity_id, parent=parent_key)
    else:
        key = client.key(entity_type)
    return key


def load_entity(client, entity_type, entity_id, parent_key=None):
    key = load_key(client, entity_type, entity_id, parent_key)
    entity = client.get(key)
    return entity



def save_grid(username, map_name, grid):
    client = get_client()
    key = load_key(client, "GridEntity", username+map_name)
    entity = datastore.Entity(key, exclude_from_indexes=(('username', 'map_name', 'map')))
    entity['map_id'] = username+map_name
    entity['username'] = username
    entity['map_name'] = map_name
    entity['map'] = json.dumps(grid)
    client.put(entity)

def load_grid(key):
    client = get_client()
    entity = load_entity(client, "GridEntity", key)
    map = entity.get('map')
    return map

def load_maps():
    client = get_client()
    q = client.query(kind="GridEntity")
    result = []
    for map in q.fetch():
        result.append(map)
    return result