import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
APP_NAME = "PAMServices/1.0 (olutobiadeleke@gmail)"


def send_overpass_node_amentity_query(
        south_coord,
        west_coord,
        north_coord,
        east_coord
    ):
    query = f"""
    [out:json][timeout:25];
    (
    node["amenity"]({south_coord},{west_coord},{north_coord},{east_coord});
    );
    out body;
    """
    try:
        response = requests.post(
            OVERPASS_URL,
            data={"data": query},
            headers={"User-Agent": APP_NAME},
            timeout=60
        )
       
        return response.json()["elements"]
    except Exception as err:
        print(err)

        return {"message": "Failed to make overpass request"}


def send_overpass_node_amentity_query_radius(
        latitude,
        longitude,
        radius_meters=5000
    ):
    query = f"""
    [out:json][timeout:25];
    (
    node["amenity"](around:{radius_meters}, {latitude}, {longitude});
    );
    out body;
    """
    try:
        response = requests.post(
            OVERPASS_URL,
            data={"data": query},
            headers={"User-Agent": APP_NAME},
            timeout=60
        )
        return response.json()["elements"]
    except Exception as err:
        print(err)
        return {"message": "Failed to make overpass request"}

