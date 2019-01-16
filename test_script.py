#!/usr/bin/python3

from pyfcm import FCMNotification


API_KEY = "AAAAWFdQKTY:APA91bFXnXpVIIjjZ9S4ajRVJW1FmzNUrsxPA51F8LP2n9MAwhvoX0lZQ1BOhZ5re7SANnol8qQ4xSaqSo-qCYFWCyMsqkTH4N__LwiEdzmKJYvYrImSAudDH86V8ni7n3t7ySw__cE-EVuA2FqRjsghCTn-I_E_zg"

push_service = FCMNotification(api_key=API_KEY)

# result = push_service.notify_topic_subscribers(
#     topic_name="ioi2017",
#     message_title="IOI 2018 — Tsukuba, Japan",
#     message_body="The contest is finished! Tap to see the final ranking.",
#     sound="Default")

result = push_service.notify_topic_subscribers(
    topic_name="ioi2017",
    message_title="Joseph's score increased!",
    message_body="The contestant Joseph Benton (GBR-3) has submitted a 50pt solution to the task 'books', increasing their score by +28pt!",
    sound="Default")

print(result)
