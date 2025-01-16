def calculate_product_match(user_keywords, product_keywords):
    if len(user_keywords) < 1:
        return 0

    user_keywords = [x.lower() for x in user_keywords]
    product_keywords = [{"name": x.lower(), "match": False} for x in product_keywords]

    matches = 0
    for keyword in product_keywords:
        if keyword["name"] in user_keywords:
            keyword["match"] = True
            matches += 1

    match_percentage = round((matches / len(product_keywords)) * 100)
    return match_percentage, product_keywords

def sort_by_match(products, spotify_music_taste):
    for product in products:
        match_percentage = -1
        updated_keywords = []

        if spotify_music_taste is not None: 
            match_percentage, updated_keywords = calculate_product_match(spotify_music_taste, product['keywords'])
        product['matchPercentage'] = match_percentage
        product['keywords'] = updated_keywords
    return sorted(products, key=lambda x: x['matchPercentage'], reverse=True)