from google.cloud import datastore
import random
import json

TYPE = "GROUPSESSION"


class GroupSession(object):
    def __init__(self, id, leader, map, fog, width, height, players=[]):
        self.id = id  # Our key and our room ID
        self.leader = leader  # The DM
        self.players = players  # The list of players connected
        self.map = map  # The map as it stands.  What to do with a placeholder? A blank map?
        self.fog = fog
        self.height = height
        self.width = width


def json_to_obj(item):  # Works for both entities and JSON
    return GroupSession(item.key.id_or_name, item["leader"], item["map"], item["fog"], item["height"], item["width"], item["players"])


def obj_to_dict(obj):  # This is so we can update entities via transforming into objects and back
    return {
        "id": obj.id,
        "leader": obj.leader,
        "map": obj.map,
        "fog": obj.fog,
        "players": obj.players,
        "height": obj.height,
        "width": obj.width
    }


def create_roomcode(client):  # Creates a valid room code for us to use
    curID = random.randint(1, 100000)

    # Check to see if our key is available.
    while client.get(client.key(TYPE, curID)) is not None:
        curID = random.randint(1, 100000)

    return curID


def loadItem(client, id):  # Loads in the entity and returns it
    return client.get(client.key(TYPE, int(id)))


def updateSession(id, map=None, fog=None, players=None, height=-1, width=-1):
    client = datastore.Client()
    item = loadItem(client, id)
    itemobj = json_to_obj(item)

    if map is not None:  # This means we want to update the map
        itemobj.map = map
        itemobj.height = height
        itemobj.width = width

    if fog is not None:
        itemobj.fog = fog

    if players is not None:  # Our players list has updated
        itemobj.players = players

    item.update(obj_to_dict(itemobj))
    res = client.put(item)

    return res  # Just the result for debugging purposes


def getSession(id):  # Returns the session as an object
    client = datastore.Client()
    item = loadItem(client, id)
    if(item is None):
        return -1
    return json_to_obj(item)


def initializeSession(leader, map="DEFAULT MAP DUMMY", fog="FOG", height=20, width=20):  # Takes the leader as input and map
    client = datastore.Client()
    id = create_roomcode(client)
    key = client.key(TYPE, id)
    item = datastore.Entity(key, exclude_from_indexes=['map', 'fog'])

    item["map"] = map
    item["fog"] = fog
    item["players"] = []
    item["leader"] = leader
    item["height"] = height
    item["width"] = width

    client.put(item)

    return json_to_obj(item)


def delSession(id):
    client = datastore.Client()
    key = client.key(TYPE, int(id))
    client.delete(key)
