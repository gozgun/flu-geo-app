from bs4 import BeautifulSoup, Tag
from requests import get
from typing import Dict, List


def get_google_news(search_phrase: str) -> List[Dict[str, str]]:
    """
    Returns Google News results for a given search phrase.

    Args:
        search_phrase: The search phrase to use.

    Returns:
        A list of dictionaries containing the title, source, time, details, and link of each article.
    """

    print("searching",search_phrase)

    ARTICLE_CLASS = "Gx5Zad xpd EtOod pkphOe"
    TITLE_CLASS = "BNeawe vvjwJb AP7Wnd"
    SOURCE_CLASS = "BNeawe UPmit AP7Wnd lRVwie"
    TIME_CLASS = "r0bn4c rQMQod"
    DETAILS_CLASS = "BNeawe s3v9rd AP7Wnd"

    def get_title(result: Tag) -> str:
        return result.find("div", class_=TITLE_CLASS).text

    def get_source(result: Tag) -> str:
        return result.find("div", class_=SOURCE_CLASS).text
    
    def get_time(result: Tag) -> str:
        return result.find("span", class_=TIME_CLASS).text

    def get_details(result: Tag) -> str:
        time = get_time(result)
        return result.find("div", class_=DETAILS_CLASS).text.replace(time, '')

    def get_link(result: Tag) -> str:
        raw_link = result.find("a", href=True)["href"]
        link = raw_link[7:]
        link = link[:link.rfind('&')]
        link = link[:link.rfind('&')]
        link = link[:link.rfind('&')]
        return link

    url = f"https://www.google.com/search?q={search_phrase}&tbm=nws&gl=CH&hl=en"
    response = get(url)
    
    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return []

    soup = BeautifulSoup(response.content, "html.parser")

    articles = []
    for result in soup.find_all("div", class_=ARTICLE_CLASS):
        try:
            articles.append({
                "title": get_title(result),
                "source": get_source(result),
                "time": get_time(result),
                "details": get_details(result),
                "link": get_link(result),
                })
        except AttributeError:
            print("AttributeError: Missing element or wrong tag structure.")
        except KeyError:
            print("KeyError: Missing 'href' in link extraction.")
        except IndexError:
            print("IndexError: Link slicing out of range.")
        except TypeError:
            print("TypeError: Incorrect data type encountered.")
        except Exception as e:
            print(f"Unexpected error: {e}")

    return articles[:6]  # Return only the first 5 articles
