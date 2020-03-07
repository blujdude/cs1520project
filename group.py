from google.cloud import datastore
import random

TYPE = "GROUPSESSION"


class GroupSession(object):
    def __init__(self, id, leader, map, players=[]):
        self.id = id  # Our key and our room ID
        self.leader = leader  # The DM
        self.players = players  # The list of players connected
        self.map = map  # The map as it stands.  What to do with a placeholder?  A blank map?


def json_to_obj(item):  # Works for both entities and JSON
    return GroupSession(item.key.id_or_name, item["leader"], item["map"], item["players"])


def obj_to_dict(obj):  # This is so we can update entities via transforming into objects and back
    return {
        "leader": obj.leader,
        "map": obj.map,
        "players": obj.players
    }


def create_roomcode(client):  # Creates a valid room code for us to use
    curID = random.randint(1, 100000)

    # Check to see if our key is available.
    while client.get(client.key(TYPE, curID)) is not None:
        curID = random.randint(1, 100000)

    return curID


def loadItem(client, id):  # Loads in the entity and returns it
    return client.get(client.key(TYPE, id))


def updateSession(id, map=None, players=None):
    client = datastore.Client()
    item = loadItem(client, id)
    itemobj = json_to_obj(item)

    if map is not None:  # This means we want to update the map
        itemobj.map = map

    if players is not None:  # Our players list has updated
        itemobj.players = players

    item.update(obj_to_dict(itemobj))
    res = client.put(item)

    return res  # Just the result for debugging purposes


def initializeSession(obj):  # Takes a GroupSession as input
    client = datastore.Client()
    id = create_roomcode(client)

    item = datastore.Entity(client.key(TYPE, id))

    item["map"] = obj.map
    item["players"] = obj.players
    item["leader"] = obj.leader

    client.put(item)

    return id


def delSession(id):
    client = datastore.Client()
    client.delete(TYPE, id)
