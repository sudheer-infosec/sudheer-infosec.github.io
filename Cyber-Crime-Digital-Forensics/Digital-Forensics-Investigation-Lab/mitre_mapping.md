# MITRE ATT&CK Mapping

## Case Information

| Field     | Value                       |
| --------- | --------------------------- |
| Case ID   | LAB-2024-001                |
| Framework | MITRE ATT&CK Enterprise     |
| Analyst   | Dhruvi Desai                |
| Dataset   | Windows XP Forensic Dataset |

---

# Overview

This document maps investigation findings to the MITRE ATT&CK framework. Only techniques supported by observable evidence were included.

Techniques reviewed but not supported by evidence are documented separately.

---

# ATT&CK Techniques Observed

| Technique ID | Technique Name                            | Evidence                                                               | Source    |
| ------------ | ----------------------------------------- | ---------------------------------------------------------------------- | --------- |
| T1071.001    | Application Layer Protocol: Web Protocols | HTTP GET and POST traffic observed during packet capture analysis      | Wireshark |
| T1071.004    | Application Layer Protocol: DNS           | Multiple DNS queries including lafontainebleu.org                      | Wireshark |
| T1204.002    | User Execution: Malicious File            | Download artifacts indicate user-initiated software execution activity | Autopsy   |
| T1027        | Obfuscated Files or Information           | Entropy value of 7.327 observed during PE analysis                     | PE Studio |

---

# Technique Details

## T1071.001 — Application Layer Protocol: Web Protocols

### Evidence

* HTTP GET requests observed during packet analysis.
* HTTP POST requests sent from 10.8.15.133 to 72.5.43.29.
* Traffic utilized standard web protocols.

### Tool

Wireshark

### Assessment

Observed activity demonstrates the use of web-based communications. Evidence was insufficient to classify communications as malicious command-and-control activity.

---

## T1071.004 — Application Layer Protocol: DNS

### Evidence

* DNS traffic identified using Wireshark.
* Queries observed for:

  * lafontainebleu.org
  * microsoft.com
  * officeclient.microsoft.com
  * msftncsi.com

### Tool

Wireshark

### Assessment

DNS communication was observed and documented. No evidence of Domain Generation Algorithm (DGA) behavior was identified.

---

## T1204.002 — User Execution

### Evidence

Recovered software download artifacts included:

* Python Installer
* Thunderbird Installer
* OpenOffice Installer

### Tool

Autopsy

### Assessment

Artifacts indicate user-initiated software download and execution activity.

---

## T1027 — Obfuscated Files or Information

### Evidence

PE Studio reported:

| Attribute | Value         |
| --------- | ------------- |
| File      | Wireshark.exe |
| Entropy   | 7.327         |

### Tool

PE Studio

### Assessment

Elevated entropy was observed. However, the analyzed file was confirmed to be a legitimate executable and no malicious obfuscation was identified.

---

# Techniques Reviewed But Not Observed

| Technique ID | Technique Name                     | Reason Not Mapped                          |
| ------------ | ---------------------------------- | ------------------------------------------ |
| T1055        | Process Injection                  | No injected PE files identified by malfind |
| T1055.012    | Process Hollowing                  | No hollow process indicators identified    |
| T1547.001    | Registry Run Keys / Startup Folder | No persistence artifacts identified        |
| T1053.005    | Scheduled Task / Job               | No suspicious scheduled tasks identified   |
| T1003        | OS Credential Dumping              | No credential dumping artifacts identified |

---

# Summary

A total of four ATT&CK techniques were mapped based on observable evidence recovered during the investigation.

The majority of findings reflected normal workstation activity. While several artifacts initially appeared suspicious, further analysis did not provide sufficient evidence to confirm malware activity or system compromise.

The ATT&CK mapping process demonstrated how forensic findings can be correlated with adversary behaviors while maintaining evidence-based reporting standards.

---

# ATT&CK Coverage Summary

| Category          | Techniques Mapped    |
| ----------------- | -------------------- |
| Command & Control | T1071.001, T1071.004 |
| Execution         | T1204.002            |
| Defense Evasion   | T1027                |

**Total Techniques Mapped:** 4

**Total Techniques Reviewed But Not Supported:** 5
