from google.cloud import datastore

def get_client():
    return datastore.Client()

def load_key(client, entity_type, entity_id=None, parent_key=None):
    '''
    key = None
    if entity_id:
        key = client.key(entity_type, entity_id, parent=parent_key)
    else:
        key = client.key(entity_type)
    return key
    '''
    return entity_id #for now

def load_entity(client, entity_type, entity_id, parent_key=None):
    '''
    key = _load_key(client, entity_type, entity_id, parent_key)
    entity = client.get(key)
    return entity
    '''
    return "adminmap1" #for now


def save_grid(username, map_name, grid):
    client = get_client()
    entity = datastore.Entity(load_key(client, "GridEntity", username+map_name))
    entity['username'] = username
    entity['map_name'] = map_name
    entity['map'] = map
    client.put(entity)

def load_grid(key):#how are you getting the key?
    client = _get_client()
    entity = load_entity(client, "GridEntity", key)
    map = entity['map']
    return map

def load_maps():
    client = _get_client()
    q = client.query(kind="GridEntity")
    result = []
    for map in q.fetch():
        result.append(map)
    return result