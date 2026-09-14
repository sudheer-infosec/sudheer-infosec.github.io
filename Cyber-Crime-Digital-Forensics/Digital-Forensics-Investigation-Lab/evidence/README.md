# 🔒 Evidence Inventory

## Overview

This directory documents all evidence sources analyzed during the DFIR Windows Investigation project.

The purpose of this inventory is to maintain proper forensic documentation practices by recording the origin, type, purpose, and integrity verification status of every evidence source used throughout the investigation.

All evidence was handled in a controlled virtual laboratory environment consisting of a Windows victim system and a REMnux forensic workstation connected through an isolated host-only network.

---

## 🎯 Evidence Handling Objectives

* Preserve forensic integrity of collected artifacts
* Maintain traceability throughout the investigation
* Verify evidence authenticity using cryptographic hashes
* Document source locations and acquisition methods
* Support reproducibility of forensic findings

---

## 📋 Evidence Inventory

| Evidence ID | Evidence Type      | Description                                  | Purpose                                |
| ----------- | ------------------ | -------------------------------------------- | -------------------------------------- |
| EV-001      | Memory Dump        | Captured RAM image from Windows system       | Memory forensics using Volatility 3    |
| EV-002      | Disk Image         | Windows forensic image analyzed in Autopsy   | Disk artifact investigation            |
| EV-003      | Network Capture    | PCAP file reviewed in Wireshark              | Network traffic analysis               |
| EV-004      | Executable Sample  | Suspicious executable collected for analysis | Static malware analysis                |
| EV-005      | Browser Artifacts  | Internet history and downloads               | User activity reconstruction           |
| EV-006      | Registry Artifacts | System and user registry information         | Persistence and configuration analysis |

---

## 🔐 Hash Verification Records

Cryptographic hashing was performed to verify evidence integrity before and during analysis.

| File            | Hash Type    | Status   |
| --------------- | ------------ | -------- |
| Memory Image    | SHA256       | Verified |
| Disk Image      | SHA256       | Verified |
| Network Capture | SHA256       | Verified |
| Malware Sample  | MD5 / SHA256 | Verified |

> Note: Actual hash values can be stored separately if evidence sharing restrictions apply.

---

## 🧪 Acquisition Summary

| Acquisition Target | Method Used             | Tool                    |
| ------------------ | ----------------------- | ----------------------- |
| Memory             | Memory Capture          | FTK Imager              |
| Disk Evidence      | Forensic Image Analysis | Autopsy                 |
| Network Traffic    | Packet Capture Review   | Wireshark               |
| Malware Sample     | Controlled Collection   | Isolated VM Environment |

---

## ⚖️ Chain of Custody Summary

| Step          | Description                                             |
| ------------- | ------------------------------------------------------- |
| Collection    | Evidence collected from isolated laboratory environment |
| Verification  | Integrity confirmed through hashing procedures          |
| Analysis      | Evidence analyzed using approved forensic tools         |
| Documentation | Findings recorded in investigation notes and reports    |
| Preservation  | Original evidence maintained unchanged                  |

---

## 🔍 Evidence Classification

| Classification        | Examples                                           |
| --------------------- | -------------------------------------------------- |
| Volatile Evidence     | Memory dump, active processes, network connections |
| Non-Volatile Evidence | Disk image, registry files, browser artifacts      |
| Network Evidence      | PCAP captures, DNS requests, HTTP traffic          |
| Malware Evidence      | Executable sample, hashes, YARA detections         |

---

## 📈 Investigation Outcomes Supported by Evidence

The evidence collected during this project enabled:

* Operating system identification through memory analysis
* Process and artifact enumeration
* Deleted file discovery
* Web history reconstruction
* USB device identification
* Network communication analysis
* Malware static assessment
* IOC extraction and documentation
* YARA rule development

---

## 🛡️ Integrity Statement

All evidence analyzed in this project was processed within an isolated DFIR laboratory environment. Original evidence sources remained unchanged throughout the investigation process, and integrity verification procedures were performed wherever applicable.

This documentation is intended for educational and portfolio demonstration purposes.
