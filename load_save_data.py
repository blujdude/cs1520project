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


def save_grid(username, map_name, grid, height, length, campaign, floor):
    client = get_client()
    print(username)
    print(map_name)
    print(campaign)
    print(floor)
    map_id = (username+"_"+campaign+"_"+map_name+"_"+floor).replace(" ", "_")
    key = load_key(client, "GridEntity", map_id)
    entity = datastore.Entity(key, exclude_from_indexes=(('height', 'length', 'map_name', 'map')))
    entity['map_id'] = map_id
    entity['username'] = username
    entity['map_name'] = map_name
    entity['map'] = json.dumps(grid)
    entity['height'] = height
    entity['length'] = length
    entity['campaign'] = campaign
    entity['floor'] = floor
    client.put(entity)


def update_grid(key, grid):
    client = get_client()
    entity = load_entity(client, "GridEntity", key)
    entity.update({
        'map': json.dumps(grid)
    })
    client.put(entity)


def load_grid(key):
    client = get_client()
    entity = load_entity(client, "GridEntity", key)
    grid = entity.get('map')
    height = entity.get('height')
    length = entity.get('length')
    map_name = entity.get('map_name')
    map_id = entity.get('map_id')
    campaign = entity.get('campaign')
    return (grid, height, length, map_name, map_id, campaign)


def load_grid_obj(key):
    client = get_client()
    entity = load_entity(client, "GridEntity", key)
    return (entity)


def load_maps(username):
    client = get_client()
    q = client.query(kind="GridEntity")
    q.add_filter('username', '=', username)
    result = []

    for map in q.fetch():
        m = {
            "map_id": map.get("map_id"),
            "campaign": map.get("campaign"),
            "map_name": map.get("map_name"),
            "floor": map.get("floor"),
        }
        result.append(json.dumps(m))
    # print(result)
    return result
