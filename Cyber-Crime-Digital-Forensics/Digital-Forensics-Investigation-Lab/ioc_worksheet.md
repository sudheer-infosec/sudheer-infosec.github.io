# Indicators and Observed Artifacts

## Case Information

| Field              | Value                                        |
| ------------------ | -------------------------------------------- |
| Case ID            | LAB-2024-001                                 |
| Investigation Type | Digital Forensics & Incident Response (DFIR) |
| Analyst            | Dhruvi Desai                                 |
| Dataset            | Windows XP Forensic Dataset                  |
| Status             | Investigation Complete                       |

---

# IOC Summary

This worksheet documents all observable indicators identified throughout the investigation. Indicators are categorized by type and assigned a confidence level based on supporting evidence.

## Confidence Scale

| Level  | Meaning                                                           |
| ------ | ----------------------------------------------------------------- |
| High   | Directly observed and verified during analysis                    |
| Medium | Observed but insufficient evidence to determine malicious intent  |
| Low    | Benign or informational artifact with limited investigative value |

---

# Network Indicators

| Type       | Indicator                  | Context                                    | Confidence |
| ---------- | -------------------------- | ------------------------------------------ | ---------- |
| IP Address | 10.8.15.133                | Victim system identified in packet capture | High       |
| IP Address | 72.5.43.29                 | Destination of HTTP POST requests          | Medium     |
| IP Address | 23.205.110.48              | Microsoft connectivity test destination    | Low        |
| Domain     | lafontainebleu.org         | DNS queries observed in Wireshark          | Medium     |
| Domain     | officeclient.microsoft.com | Microsoft service traffic                  | Low        |
| Domain     | msftncsi.com               | Windows connectivity check                 | Low        |
| Domain     | microsoft.com              | Standard Microsoft communication           | Low        |

---

# URL Indicators

| URL                                                  | Context                                          | Confidence |
| ---------------------------------------------------- | ------------------------------------------------ | ---------- |
| http://www.python.org/ftp/python/2.6.4/python-2.6... | Download artifact recovered from browser history | High       |

---

# File Indicators

## SHA256 Hash

| Artifact      | SHA256                                                           |
| ------------- | ---------------------------------------------------------------- |
| Wireshark.exe | 99DC13045CC75BA9FEAEB8E9C56A1BE0E2C22DEAC15B474A435469B33E6D76B1 |

## MD5 Hash

| Artifact      | MD5                              |
| ------------- | -------------------------------- |
| Wireshark.exe | 5DD9D2DB30F70063BFCAB99450417CE4 |

---

# Process Indicators

| Process         | PID  | Context                    | Confidence |
| --------------- | ---- | -------------------------- | ---------- |
| firefox.exe     | 2684 | Active web browser process | High       |
| thunderbird.exe | 764  | Active email client        | High       |
| cmd.exe         | 3124 | Interactive command shell  | High       |
| mdd_1.3.exe     | 3336 | Memory acquisition utility | High       |

---

# Registry Indicators

No suspicious registry persistence artifacts were identified during the investigation.

| Artifact                   | Result       |
| -------------------------- | ------------ |
| Registry Run Keys          | Not Observed |
| Startup Folder Persistence | Not Observed |
| Suspicious Autoruns        | Not Observed |

---

# Mutex Indicators

No mutex artifacts were identified during memory or static analysis.

| Artifact Type | Result          |
| ------------- | --------------- |
| Mutex Names   | None Identified |

---

# Scheduled Task Indicators

No suspicious scheduled tasks were identified.

| Artifact Type   | Result          |
| --------------- | --------------- |
| Scheduled Tasks | None Identified |

---

# Investigation Notes

Several indicators initially appeared noteworthy, including HTTP POST requests and DNS queries to external domains. However, additional analysis did not provide sufficient evidence to classify these indicators as malicious.

Indicators were retained for documentation purposes and to demonstrate the IOC extraction process used during the investigation.

---

# Final Assessment

No definitive Indicators of Compromise associated with active malware infection were identified within the scope of this investigation.

The documented indicators represent observable artifacts recovered from memory, disk, and network evidence and were retained to support forensic reporting and ATT&CK mapping activities.
