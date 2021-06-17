import json
import os
import re

import requests
from bs4 import BeautifulSoup

techulus_api_key = os.environ["TECHULUS_API_KEY"]


def main():
    filename = "stores.json"
    previous_data = fetch_old_data(filename)
    new_data = fetch_new_data()
    if previous_data != new_data:
        diff = list(set(new_data) - set(previous_data))
        notify(diff)
        write_new_data(new_data, filename)



def notify(diff):
    print("new data", diff)
    print("Sending notification with new data")
    res = requests.post(
        "https://push.techulus.com/api/v1/notify",
        json={"body": json.dumps(diff), "title": "New TV's in stores"},
        headers={"x-api-key": techulus_api_key},
    )
    res.raise_for_status()
    print(res.text)


def fetch_old_data(filename):
    with open(filename, "r") as f:
        return json.load(f)


def write_new_data(new_data, filename):
    with open(filename, "w") as f:
        json.dump(new_data, f, indent=4)

def get_store_name(storestring: str) -> str:
    return re.search("\'(.*)\'", storestring).group(0)

def fetch_new_data():
    res = requests.get(
        "https://www.elkjop.no/INTERSHOP/web/WFS/store-elkjop-Site/no_NO/-/NOK/CC_ViewStoreLocator-ProductDetailInclude?ProductUUID=1D6sGQWFhxEAAAFygnjkB8JG&html"
    )
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")
    script_lines = soup.find("script").string.split("\n")
    stores_with_tv = [get_store_name(l) for l in script_lines if "StoreCodeName" in l]
    return stores_with_tv



if __name__ == "__main__":
    main()
