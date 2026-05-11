---
layout: post
title: "Schuldiner's Numbers: I Built a Data Dashboard for Death's Entire Discography"
categories: ["Business Intelligence"]
image: /assets/img/death.png
---
### [Dashboard Link](https://deathdiscography-h9p46woir6f86utjcw2ikh.streamlit.app)

May 13th is Chuck Schuldiner's birthday. And if you know, you know — Chuck wasn't just a musician. He was the architect, the Godfather of an entire genre, the guy who almost single-handedly dragged metal into places it had never been before. So this year, instead of just putting on all Death's discography and staring at the ceiling, I built something: a fully interactive analytics dashboard covering Death's complete studio discography. Consider it a love letter written in Python.
  
The project started simple enough — pull some data, make some charts, feel good about it. But anyone who's worked with music APIs knows they have a personality of their own. Between Spotify, Last.fm, MusicBrainz, and AcousticBrainz, I was juggling four different sources, each with their own quirks, gaps, and opinions on what counts as an "official release." Remastered editions pretending to be originals. Compilation tracks sneaking into tracklists. I had to build custom cleaning logic just to keep things honest. The rule was simple: 7 studio albums, 62 songs, nothing else. No compilations, no demos, no bonus disc filler. Just the canon — from Scream Bloody Gore (1987) all the way to The Sound of Perseverance (1998).
Once the data was clean, the fun started. The dashboard — built with Streamlit and Plotly — lets you explore the full discography in a way that actually feels alive. You can trace the band's evolution through a release timeline, see how BPM and track duration shifted as Chuck's songwriting got more progressive and technically ambitious, and compare listener counts and playcounts across albums to see which records the internet still obsesses over (spoiler: Symbolic and Sound of Perseverance are doing numbers). There's track-level filtering and ranking, so you can surface the longest, fastest, or most-streamed songs in the catalogue, and a head-to-head album comparison tool for when you want hard data to settle a debate about whether Human or Leprosy was the bigger leap forward.  
  
The top three songs with highest number of listeners are:
1. Voice of the Soul: +364K
2. Symbolic: +311K
3. Crystal Mountain: +278K  
<img width="1316" height="970" alt="image" src="https://github.com/user-attachments/assets/9d1acd94-cf39-4dd7-9d74-55c3d7f12ebf" />

    
Surprisignly, the fastest record (calculated based on average BPM per song) is Spiritual Healing with 144.7 BPM followed by Symbolic with 141 BPM.
<img width="2612" height="852" alt="image" src="https://github.com/user-attachments/assets/d944677c-397e-4b19-b935-ee38fcd589ae" />

The albums with highest number of listeners are:
1. Sound of Perseverance: 1.82MM (Voice of the Soul represents 19.8% of all the listeners)
2. Symbolic: 1.81MM (32.5% of the streams are coming from Symbolic and Crystal Mountain)
3. Scream Bloody Gore: 1.35MM  


_Sound of Perseverance seems to be 1.08% more popular than Symbolic and also 130% more than the least streamed (Spiritual Healing) with about a 79% difference in popularity._
<img width="2590" height="1020" alt="image" src="https://github.com/user-attachments/assets/f51208f1-d0cd-4614-a548-31841379c85d" />

  In this web app you can also compare the difference between two different records - this includes: lenght, BPM, tracks, listeners, fastest vs slowest song and the most and least popular song on the record.
<img width="2230" height="1196" alt="image" src="https://github.com/user-attachments/assets/08bd6a9a-90b9-4620-8b8d-9a7379a7d9d1" />



  As a BA, this kind of project sits right in the sweet spot of what I love — taking messy, scattered information and turning it into something clear, navigable, and actually useful. The domain being Death's discography just made it a whole lot more meaningful. Chuck left behind 11 years of recorded work that keeps pulling in new listeners decades later, and spending time this close to that catalogue — track by track, BPM by BPM — reminded me exactly why. Happy birthday, Chuck. The legacy is very much intact. Support Music not rumours.
  
I hope you enjoy this dashboard.
  
PS: I did not forgeet about Control Denied but I wanted to focus mainly on Death's records. Maybe in the future I will add the numbers for The Fragile Art of Existence.
  
Thanks.

Mauricio Ruiz
Data Analyst. 

{% include share.html %}


