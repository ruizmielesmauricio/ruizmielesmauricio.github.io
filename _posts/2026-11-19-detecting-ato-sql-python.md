---
layout: post
title: "Read the Warning Flags: Detecting ATO with SQL and Python"
date: 2026-11-19
categories: [Data Analytics, Fraud Detection]
tags: [SQL, Python, Cybersecurity, Account Takeover]
image: /assets/img/ato/ato-cover.svg
description: "A practical account takeover investigation walkthrough using SQL event analysis and transparent Python risk scoring."
---

“It’s unusual to have no fraud whatsoever”. This is one of the most shocking lines from an online report released by Stripe [[1]](https://docs.stripe.com/issuing/manage-fraud).  Fraud has become one of our daily concerns. Over the last couple of years we are getting constantly targeted by scammers in many different ways: over the phone, with text messages, on our emails, while online shopping among some others. Regardless you are an individual who does a 9 to 5 with a monthly salary, an entrepreneur or a big corporation fraudsters are looking for a way to steal our data and more. Currently frauds and scams are at the distance of a call or a click. They vary and they have different MOs and ways to disguise themselves. As data analysts we should learn how we can use data to reduce cyber attacks that compromise our data. 
As a data analyst working on e-commerce I will focus on how businesses get affected. 
To understand a bit more the concerns addressed in this article I will provide a short context on the last few years of online commerce. After Covid, e-commerce  experienced an exponential growth. Companies with online presence are victims of these illegal activities in different ways. There are millions of online companies out there and they all offer different services as well as they use different online services themselves.
Some of those services take care of how companies receive their payments. 

A perfect example is Stripe. The payments company has released some interesting information on how companies that use their services have been affected due to fraudulent actors. According to a report released by the company in September 2026 [[2]](https://stripe.com/blog/what-stripe-data-shows-about-fraud-at-ai-startups), AI companies using Stripe saw a 40% increase in attempts to abuse from multi sign up accounts compared to January 2026. They list different types of abuse and present some relevant information that can be used to identify possible attacks. The attacks on companies could be divided into three categories: 

1. Account creation and sign-up abuse: Creating accounts (users or companies) using deceptive or manipulated information.
2. Account Takeover: ATO happens when an unauthorised third party gets access to an established account. In the case of ATO data that can be used to verify the compromised account can be inconsistent IP or browser logins compared to previous sessions, changes on emails used to sign up [[4]](https://stripe.com/gb/resources/more/account-takeover-fraud-explained).
3. Payment and transaction fraud: Abusing transactions, payment methods or transfers

As Stripe mentions, fraudulent or abuse activity differs based on different factors such as type of business, geography or business model among others.

However, attacks or threats usually leave digital footprints often. Recognizing these signals and understand which ones are malicious will allow us as data analysts to uncover patterns and create systems that will detect threats automatically by using these data points combined with historical data.  

For this article we will focus on how ATO can be identified automatically using SQL and Python. 

Having worked previously as a QA in Fake Accounts gave me the insights on what needs to reviewed when there are possible attempts to hijack an account. These flags are also validated by Group IB [[3]](https://www.group-ib.com/resources/knowledge-hub/account-takeover/). Let’s get to know signals that can be used to determine attacks

- Login Anomalies: Different attempts to login from an unknown or masked IP. Usually happen in a short period of time.
- Devices/Session inconsistencies: Unusual New or unknown devices used to attempt to login
- Geolocation mismatches: Attempts to login from a different country that usual.
- Reset password requests
- Drastic changes in account settings: Email and password changes
- Suspicious transactions or activity. It’s worth to mention some of these ones that Stripe lists:
    - Inbound Transfer Fraud: This happens when a fraudulent actor moves funds to a business account and then withdraws the money. This will cause a reverse payment from the sending bank and funds will be reverted to the original account.
    - Authorize Push Payment Fraud: Commonly in this cases the business approves the transactions to a third party that is the fraudulent part. [[5]](https://docs.stripe.com/treasury/connect/fraud-guide?locale=en-GB#fraud-control-layers).

This give us a useful baseline to understand what features we need look at in the data that would help us to unveil possible attacks. Now, it is important as well to understand the different MOs the hackers use to deceive the victim or to attack the platform. 

---

## How do accounts get compromised?

![Illustrative account takeover sequence: credential exposure, unexpected login, account changes, investigation]({{ "/assets/img/ato/attack-chain.svg" | relative_url }})

*Figure: One possible account takeover sequence. Signals do not establish fraud on their own.*

In 2023, 23andMe was a victim of credential stuffing (MO). The attackers got access to over **7 million users’ data** according to the Office of the Privacy Commissioner of Canada [[9]](https://www.priv.gc.ca/en/opc-news/news-and-announcements/2025/bg_23andme_250617/) by using credentials leaked from previous breaches. The company was **fined for £2.31 million** in the UK for not protecting their clients’ privacy as informed by ICO-UK [[10]](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/06/23andme-fined-for-failing-to-protect-uk-users-genetic-data/?utm_source=chatgpt.com).

There are many different MOs that scammers use to deceive users. Sometimes the lack of knowledge of how these operate will cause businesses or users to bite the bait. Over here I will provide some details on how businesses can be more careful and check some details when engaging in activities that could affect their finances.

- **Phishing:** Uses social engineering and dupes users to click a link, make a phone call, answer an email or get malicious softwares that will lead to hand over credentials to the attacker. There are many different ways this could be done like email poofing, social media interactions among some others. [[6]](https://attack.mitre.org/techniques/T1566/)
- **Malwares:** Defined by CSRC  [[7]](https://csrc.nist.gov/glossary/term/malware) as “Hardware, firmware, or software that is intentionally included or inserted in a system for a harmful purpose”.
- **Credential Stuffing:** It’s a usually data obtained from other sources that contains a pair of variables (username and password). Fraudsters would use these credentials to confirm the validity in different services so they can gain access to accounts. [[8]](https://github.com/OWASP/www-project-automated-threats-to-web-applications/blob/14da2ff2ca1f430b8c9d8742396fbc433a7240e6/assets/oats/EN/OAT-008_Credential_Stuffing.md)
- **Credential cracking:** It’s an automated attack that tries to match the password to a user by using different combinations [[13]](https://github.com/OWASP/www-project-automated-threats-to-web-applications/blob/14da2ff2ca1f430b8c9d8742396fbc433a7240e6/assets/oats/EN/OAT-007_Credential_Cracking.md). Commonly uses a dictionary with different password combinations.
- **Man-in-the-middle attacks:** (Also know as adversary-in-the-middle - AiTM) It is an attack where the threat positions itself between the authentication process and the system so it can intercept the data [[11]](https://csrc.nist.gov/glossary/term/mitm). The most common MO is the threat uses a proxy site between the user and the intended site the user wants to visit, so the credentials can be hacked.
- **Session hijacking:** When a user validates its credentials they are saved as a cookie. The threat steals these cookies or tokens and revalidates the session [[12]](https://csrc.nist.gov/glossary/term/session_hijack_attack). This is why the process is called hijacking. A common way to gain access to these cookies is using malwares. A recent discovered malware is LummaStealer that uses captcha to guide users to perform a series of actions to trigger the malware [[14]](https://blog.qualys.com/vulnerabilities-threat-research/2024/10/20/unmasking-lumma-stealer-analyzing-deceptive-tactics-with-fake-captcha). The malware is “designed to extract sensitive data such as login credentials, personal information, and payment details” [[15]](https://www.huntress.com/threat-library/malware/lumma-stealer).

These MOs are different  ways to attack but they can produce similar evidence. They can include unsuccessful login attempts or changes in IP/Cookies or Geolocation access points. These are still strong signals that can be used as a baseline to use an automated investigation system. 

## How can we as analyst automate fraud detection?

As an example, we can mention Stripe which offers a service called *Radar* that is an algorithm trained on historical data from millions of businesses and it targets fraudulent activities. The main services focus on block fraudulent payments, flag suspicious accounts and prevent customer abuse in real time. [[16]](https://stripe.com/ie/radar)

Now, from our perspective as Data Analyst we can use all the information previously presented, take all the records related to these signal  and create automated solutions to reduce the risk businesses and users are exposed to.

There are variables we can gather and from historical data create sucessful tools to protect our clients. Some of those are

- IP Addresses
- User Email
- Email change attempts
- Browser cookies
- Password reset requests
- Failed login attempts
- Browser Geolocation
- Phone codes
- Users country account creation
- User’s name

All the data entry collected must log: when, where, who and what - for each event. This is recommended by OWASP [[17]](http://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#purpose). 

Knowing all this, we can use SQL and Python to create automated tools that can keep our users safer. 

The model should deploy the following

![ATO detection pipeline: events are processed by SQL, evaluated with Python and reviewed by investigators]({{ "/assets/img/ato/detection-pipeline.svg" | relative_url }})

*Figure: Educational rule-based ATO investigation workflow.*

Using SQL we can filter the information triggering the alerts, for example: multiple failed login attempts from IPs not located in the last successful login session from a device not previously used by the user. 

These flags should be scored in our code and assess if they are statistically meaningful. This will provide a good scoring system to trigger the alerts when any possible hijacking account could be happening. 

### Building a starter Account Takeover (ATO) detection model

Using synthetic data I create a prototype that can be used as a start point to develop a more complex model. The flags used are based on the signals that listed here but every business will have different requirements as well as different possible signals. The scores used for each of the suspicious activities are based on a simple subjective assessment but this can be developed even further using statistics. It is important to mention these are flags that raise suspicious rather than actual deterministic factors of fraud. They need to be analyzed individually and as a group to determine whether we are in presence of an ATO or just some changes in the users’ behaviors. 

Now, let’s focus on how it is implemented:

A practical way to turn these observations into an investigation workflow is to combine **SQL event analysis** with **Python risk scoring**. SQL identifies unusual sequences of events; Python assigns provisional weights, creates an alert queue and evaluates how frequently the rules detect both genuine fraud and legitimate activity.

> ⚠️ **Important context**
> 
> **Purpose and limitation.** The example below is a recommended *starting framework* for discovering and prioritising red flags associated with possible fraudulent account activity. It is educational, uses synthetic data, and is **not a production-ready fraud model** or a description of Stripe's proprietary detection logic. A score indicates investigation priority, not a probability of fraud or proof of account takeover.



### 1. What data does the model use?

An account's authentication and security history can be represented as a sequence of events. The model in this exercise used the following features:

| Feature | Meaning | Why it may matter |
| --- | --- | --- |
| `account_id` | Identifier connecting activity to an account | Lets us investigate one account's history |
| `event_time` | Time an action was recorded | Reveals suspicious sequences and speed |
| `event_type` | Login, email change, password change/reset, or sensitive action | Explains what happened |
| `success` | Whether the action succeeded | Separates failed attempts from completed actions |
| `device_id` | Simplified device reference | Helps identify previously unseen devices |
| `ip_address` | Network address associated with the event | Provides network context; not definitive proof of location |
| `country` and `home_country` | Recorded activity country and account reference country | May highlight unfamiliar locations, though travel and VPNs are legitimate explanations |
| `session_id` (exploratory) | Links actions to an authenticated session | Helps investigate how a sensitive action was authorised |
| `confirmed_ato` | Synthetic outcome label: 1 fraud, 0 legitimate | Used **only for evaluation**, never to calculate scores |

The dataset should capture **who, what, when and relevant context** (as established before) for each event, while minimising personal data. Passwords, session cookies and recovery tokens must not be stored in plain-text analytics logs.

### 2. The detection flags and their provisional scores

This is a way to start, using six rule indicators. Each returns **1 if the condition is present and 0 otherwise**.

| Rule | What triggers it | Weight |
| --- | --- | --- |
| **R1** | At least six failed login attempts in a rolling 15-minute window | **20** |
| **R2** | Successful login using a device absent from previous successful-login history, from a country different from the account's home country | **30** |
| **R3** | Sensitive action from a device absent from previous successful-login history, in an unusual country | **50** |
| **R4** | Email change within 30 minutes after an R2-type unusual successful login | **50** |
| **R5A** | Successful password change/reset from a device not observed in earlier successful logins | **40** |
| **R5B** | Email change followed by a successful password change/reset within 30 minutes | **20** |

**Why these weights?** A burst of failed logins (R1) may indicate an attack attempt without successful access, while an unfamiliar successful login (R2) deserves closer review. A sensitive action (R3) or a change in account-control information (R4) can be more consequential. Password changes (R5A) deserve scrutiny, but they also happen routinely; combining account-security changes (R5B) may add context. These weights are *hypotheses* used to teach risk prioritisation and not empirically trained coefficients.

Note that some rules can overlap. For instance, R4 and R5B may relate to the same email-change sequence, so adding their scores can double-count correlated evidence. A mature model would account for these relationships.

### 3. SQL — Identify red flags from authentication events

Assume a SQLite database has two tables: `accounts(account_id, home_country, ...)` and `auth_events(account_id, event_time, event_type, success, device_id, country, ...)`.

The following SQL produces one row per account and the six binary flags:

```sql
-- SECTION 1/5: Find concentrated failed login attempts (R1).
-- A rolling 900-second window = 15 minutes for each account.
-- This detects attempted access, not proof of successful takeover.
WITH failed_attempts AS (
    SELECT account_id, event_time,
           COUNT(*) OVER (
               PARTITION BY account_id
               ORDER BY unixepoch(event_time)
               RANGE BETWEEN 900 PRECEDING AND CURRENT ROW
           ) AS failed_in_15m
    FROM auth_events
    WHERE event_type = 'login' AND success = 0
),
r1 AS (
    SELECT DISTINCT account_id
    FROM failed_attempts WHERE failed_in_15m >= 6
),

-- SECTION 2/5: Establish account login history.
-- R2 compares new successful logins to previous known devices and home country.
successful_logins AS (
    SELECT e.account_id, e.event_time, e.device_id,
           e.country, a.home_country
    FROM auth_events e
    JOIN accounts a ON a.account_id = e.account_id
    WHERE e.event_type = 'login' AND e.success = 1
),
unusual_logins AS (
    SELECT l.*
    FROM successful_logins l
    WHERE l.country <> l.home_country
      AND EXISTS (
          SELECT 1 FROM successful_logins h
          WHERE h.account_id = l.account_id
            AND h.event_time < l.event_time
      )
      AND NOT EXISTS (
          SELECT 1 FROM successful_logins h
          WHERE h.account_id = l.account_id
            AND h.device_id = l.device_id
            AND h.event_time < l.event_time
      )
),
r2 AS (SELECT DISTINCT account_id FROM unusual_logins),

-- SECTION 3/5: Look for unusual sensitive actions (R3).
-- R3 requires an earlier login history, unusual country, and unseen device.
r3 AS (
    SELECT DISTINCT e.account_id
    FROM auth_events e
    JOIN accounts a ON a.account_id = e.account_id
    WHERE e.event_type = 'sensitive_action'
      AND e.country <> a.home_country
      AND EXISTS (
          SELECT 1 FROM successful_logins h
          WHERE h.account_id = e.account_id
            AND h.event_time < e.event_time
      )
      AND NOT EXISTS (
          SELECT 1 FROM successful_logins h
          WHERE h.account_id = e.account_id
            AND h.device_id = e.device_id
            AND h.event_time < e.event_time
      )
),

-- SECTION 4/5: Identify sequences of account-security changes (R4, R5A, R5B).
-- 1800 seconds = 30 minutes; timing is suggestive, not conclusive.
r4 AS (
    SELECT DISTINCT l.account_id
    FROM unusual_logins l
    JOIN auth_events e ON e.account_id = l.account_id
     AND e.event_type = 'email_change' AND e.success = 1
     AND unixepoch(e.event_time) > unixepoch(l.event_time)
     AND unixepoch(e.event_time) <= unixepoch(l.event_time) + 1800
),
r5a AS (
    SELECT DISTINCT p.account_id
    FROM auth_events p
    WHERE p.event_type IN ('password_change',
                           'password_reset_completed')
      AND p.success = 1
      AND EXISTS (
          SELECT 1 FROM successful_logins h
          WHERE h.account_id = p.account_id
            AND h.event_time < p.event_time
      )
      AND NOT EXISTS (
          SELECT 1 FROM successful_logins h
          WHERE h.account_id = p.account_id
            AND h.device_id = p.device_id
            AND h.event_time < p.event_time
      )
),
r5b AS (
    SELECT DISTINCT e.account_id
    FROM auth_events e
    JOIN auth_events p ON p.account_id = e.account_id
     AND p.event_type IN ('password_change',
                          'password_reset_completed')
     AND p.success = 1
     AND unixepoch(p.event_time) > unixepoch(e.event_time)
     AND unixepoch(p.event_time) <= unixepoch(e.event_time) + 1800
    WHERE e.event_type = 'email_change' AND e.success = 1
)

-- SECTION 5/5: Produce one account-level row with six binary flags.
-- LEFT JOIN keeps accounts without any flags so we can evaluate false negatives.
SELECT a.account_id,
       CASE WHEN r1.account_id IS NOT NULL THEN 1 ELSE 0 END AS R1,
       CASE WHEN r2.account_id IS NOT NULL THEN 1 ELSE 0 END AS R2,
       CASE WHEN r3.account_id IS NOT NULL THEN 1 ELSE 0 END AS R3,
       CASE WHEN r4.account_id IS NOT NULL THEN 1 ELSE 0 END AS R4,
       CASE WHEN r5a.account_id IS NOT NULL THEN 1 ELSE 0 END AS R5A,
       CASE WHEN r5b.account_id IS NOT NULL THEN 1 ELSE 0 END AS R5B
FROM accounts a
LEFT JOIN r1 ON r1.account_id = a.account_id
LEFT JOIN r2 ON r2.account_id = a.account_id
LEFT JOIN r3 ON r3.account_id = a.account_id
LEFT JOIN r4 ON r4.account_id = a.account_id
LEFT JOIN r5a ON r5a.account_id = a.account_id
LEFT JOIN r5b ON r5b.account_id = a.account_id
ORDER BY a.account_id;
```

**How the SQL works:** The `WITH` clauses are Common Table Expressions (CTEs), which separate the detection logic into readable steps. `COUNT(*) OVER` calculates failed-login counts across rolling 900-second windows. `PARTITION BY` keeps accounts separate. `EXISTS` and `NOT EXISTS` compare current events with historical successful logins. `unixepoch()` turns timestamps into seconds so that 30-minute intervals can be measured. `SELECT DISTINCT` avoids returning multiple rows for one account per rule. `LEFT JOIN` preserves accounts with no flags—essential when measuring false negatives and true negatives. Finally, `CASE WHEN` converts results into 1/0 features.

**Key caveat:** The query links email/password changes at the account level using timestamps; it does not establish that the same session performed each action. Real detection should use independently recorded session identifiers.

### 4. Python — Assign risk scores and generate alerts

We can use `pandas` to read the SQL output and apply the proposed weights. Store the SQL above in the variable `sql_rules` before running this cell.

```python
# SECTION 1/3 — Load the account-level flags generated by SQL.
# The SQL query above must be saved as a Python triple-quoted string
# named sql_rules before you execute this cell.
import sqlite3
import pandas as pd

conn = sqlite3.connect("fraud_lab_v5.db")
# Example: sql_rules = """WITH failed_attempts AS (...complete query...)"""
features = pd.read_sql_query(sql_rules, conn)

# SECTION 2/3 — Set illustrative weights, not calibrated fraud probabilities.
weights = {
    "R1": 20, "R2": 30, "R3": 50,
    "R4": 50, "R5A": 40, "R5B": 20
}
threshold = 30

# Each rule is 0/1. Multiply by its weight, sum, then cap at 100.
features["risk_score"] = sum(
    features[rule] * weight
    for rule, weight in weights.items()
).clip(upper=100)

# Accounts scoring 30 or more enter the investigation queue.
features["alert"] = (
    features["risk_score"] >= threshold
).astype(int)
```

```python
# SECTION 3/3 — Explain alerts and prioritise investigator review.
# Preserve which rules fired instead of showing an unexplained score.
features["triggered_rules"] = features[list(weights)].apply(
    lambda row: ", ".join(
        rule for rule in weights if row[rule] == 1
    ) or "None",
    axis=1
)

def priority(score):
    # Illustrative triage bands; intervention needs human judgment.
    if score >= 80: return "Critical"
    if score >= 50: return "High"
    if score >= 30: return "Medium"
    return "No alert"

features["priority"] = features["risk_score"].apply(priority)

# The strongest alerts appear first. This is a review list, not a verdict.
queue = features[features["alert"] == 1].sort_values(
    ["risk_score", "account_id"],
    ascending=[False, True]
)

display(queue[[
    "account_id", "risk_score",
    "triggered_rules", "priority"
]].head(20))
```

**How Python works:** The `weights` dictionary specifies rule values. Multiplication combines each binary flag with its weight. `sum()` adds the contributions; `.clip(upper=100)` caps the illustrative score. `>= threshold` creates an alert whenever a score reaches 30; `.astype(int)` represents it as 1/0. The row-wise `.apply()` records why the account was flagged. The final `queue` is sorted so that investigators review more concerning accounts first.

**Illustrative scoring example:** An account triggering R1, R2 and R4 receives `20 + 30 + 50 = 100`. An account triggering only R2 receives `30` and enters the review queue. Neither score proves the account is compromised.

### 5. Evaluating accuracy: false positives and missed fraud

A high-risk score is only useful if we test whether the model finds genuine fraud while controlling unnecessary alerts.

| Outcome | Prediction | Reality |
| --- | --- | --- |
| True positive (TP) | Fraud | Fraud |
| False positive (FP) | Fraud | Legitimate |
| False negative (FN) | No fraud | Fraud |
| True negative (TN) | No fraud | Legitimate |

**Precision = TP / (TP + FP)** measures the proportion of alerts that are actual fraud. **Recall = TP / (TP + FN)** measures the proportion of all fraud cases detected.

```python
# SECTION 1/2 — Compare predictions with synthetic ground truth.
# confirmed_ato is NEVER used to assign scores; it is for evaluation only.
labels = pd.read_csv("ground_truth_v5.csv")
evaluated = features.merge(
    labels[["account_id", "confirmed_ato"]],
    on="account_id", validate="one_to_one"
)

actual = evaluated["confirmed_ato"]  # Actual label: 1=ATO, 0=legitimate.
pred = evaluated["alert"]            # Predicted alert: 1=flag, 0=no flag.

# TP = fraud correctly flagged; FP = legitimate account flagged.
# FN = fraud missed; TN = legitimate account correctly left unflagged.
tp = int(((actual == 1) & (pred == 1)).sum())
fp = int(((actual == 0) & (pred == 1)).sum())
fn = int(((actual == 1) & (pred == 0)).sum())
tn = int(((actual == 0) & (pred == 0)).sum())
```

```python
# SECTION 2/2 — Calculate precision and recall.
# Precision asks: of the alerts, how many are labelled ATO?
# Recall asks: of all labelled ATO cases, how many did we flag?
# The denominator guards prevent division by zero.
precision = tp / (tp + fp) if tp + fp else 0
recall = tp / (tp + fn) if tp + fn else 0

print(f"TP={tp}, FP={fp}, FN={fn}, TN={tn}")
print(f"Precision={precision:.1%}, Recall={recall:.1%}")
```

### 6. How to make this model useful beyond a learning exercise

- **Gather stronger authentication evidence:** Actual session IDs, login methods, verified device history, successful or failed step-up authentication, password-recovery pathways, and session revocations. Avoid collecting raw credentials or session tokens.
- **Analyse financial and account-control events:** Payout destination changes, API-key issuance, new administrators, unexpected transfers and other sensitive actions. These may be more informative than geography alone.
- **Reduce double-counting:** Test correlations between R4/R5B and R3/session indicators; consider feature interactions or nonadditive scoring.
- **Evaluate costs and capacity:** Measure alert volume, precision, recall, false-positive rate, expected harm, investigation workload and the effect of step-up authentication.
- **Keep human oversight:** An alert can lead to monitoring, trusted-channel verification, manual investigation or urgent protective escalation according to evidence and policy. It should not automatically be treated as proof of fraud.

**Final takeaway:** A rule-based SQL/Python system is a transparent first step for discovering suspicious behaviour and prioritising investigations. Its most important job is to identify *which activity deserves closer examination and why*. Reliable fraud prevention depends on better evidence, careful validation and proportionate responses—not simply adding more flags or raising risk scores.

---

## Practical implementation — Fraud Investigation Lab

The complete educational SQL and Python implementation, feature dictionary, rule weights, scoring, evaluation, case investigations, session analysis and improvement recommendations are available in the [Fraud Investigation Lab — Complete SQL & Python ATO Detection Guide](https://app.notion.com/p/4146d063645a81a6a915e8c9ed05d29c).

## References and further reading

1. https://docs.stripe.com/issuing/manage-fraud
2. https://stripe.com/blog/what-stripe-data-shows-about-fraud-at-ai-startups
3. https://www.group-ib.com/resources/knowledge-hub/account-takeover/
4. https://stripe.com/gb/resources/more/account-takeover-fraud-explained
5. https://docs.stripe.com/treasury/connect/fraud-guide?locale=en-GB#fraud-control-layers
6. https://attack.mitre.org/techniques/T1566/
7. https://csrc.nist.gov/glossary/term/malware
8. https://github.com/OWASP/www-project-automated-threats-to-web-applications/blob/14da2ff2ca1f430b8c9d8742396fbc433a7240e6/assets/oats/EN/OAT-008_Credential_Stuffing.md
9. https://www.priv.gc.ca/en/opc-news/news-and-announcements/2025/bg_23andme_250617/
10. https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/06/23andme-fined-for-failing-to-protect-uk-users-genetic-data/?utm_source=chatgpt.com
11. https://csrc.nist.gov/glossary/term/mitm
12. https://csrc.nist.gov/glossary/term/session_hijack_attack
13. https://github.com/OWASP/www-project-automated-threats-to-web-applications/blob/14da2ff2ca1f430b8c9d8742396fbc433a7240e6/assets/oats/EN/OAT-007_Credential_Cracking.md
14. https://blog.qualys.com/vulnerabilities-threat-research/2024/10/20/unmasking-lumma-stealer-analyzing-deceptive-tactics-with-fake-captcha
15. https://www.huntress.com/threat-library/malware/lumma-stealer
16. https://stripe.com/ie/radar
17. http://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#purpose
