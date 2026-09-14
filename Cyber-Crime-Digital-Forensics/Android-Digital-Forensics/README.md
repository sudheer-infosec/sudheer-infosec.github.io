# Android Digital Forensics Evidence Acquisition and Analysis Lab

<p align="center">
  <strong>Evidence Integrity Verification, Image Conversion, Android Artifact Analysis, and Reporting with FTK Imager and Autopsy</strong>
</p>

---

## Overview

This lab documents the acquisition and examination of an Android forensic image using **FTK Imager** and **Autopsy**. I verified the integrity of an AFF evidence image, converted it to the E01 format, configured an Autopsy case, analyzed Android application data, recovered a downloaded text file, reviewed encrypted Proton Mail artifacts, and generated an HTML forensic report.

The investigation focused on preserving evidence integrity while identifying communication, credential, browsing, application, and encrypted email artifacts from the Android file system.

> **Training Scenario:** This repository documents an authorized educational lab completed in a controlled virtual environment.

---

## Lab Objectives

- Verify the integrity of a forensic image.
- Convert an AFF image into the E01 format.
- Configure an Autopsy case and ingest the converted evidence.
- Explore the Android file system.
- Analyze Slack cached data and downloaded files.
- Review Proton Mail database artifacts and PGP-encrypted content.
- Generate and review an Autopsy HTML report.

---

## Skills Demonstrated

- Digital evidence handling and image preparation
- Forensic image verification
- MD5 and SHA-1 integrity validation
- AFF-to-E01 image conversion
- FTK Imager operation
- Autopsy case creation
- Android file-system navigation
- aLEAPP ingest configuration
- SQLite and write-ahead log analysis
- JSON artifact review
- File extraction
- PGP artifact identification
- Web-history and search analysis
- Forensic report generation

---

## Lab Environment

| Component | Details |
|---|---|
| Virtual Machine | `ZYWIN01` |
| Operating System | Windows Server 2022 |
| Imaging Tool | FTK Imager |
| Analysis Tool | Autopsy 4.20.0 |
| Android Parser | Android Analyzer (aLEAPP) |
| Source Image | `file_000.aff` |
| Converted Image | `evidence.E01` |
| Android Version | Android 9.0-r2 |

---

## Case Information

| Field | Value |
|---|---|
| Case Number | `2023_11_09` |
| Evidence Number | `12345` |
| Unique Description | `Android Forensics` |
| Examiner | `Dontrell Wilson` |
| Notes | `N/A` |
| Autopsy Case Name | `2023_11_09` |

---

## Task 1: Verify Image Integrity

I opened FTK Imager and added the following evidence image:

```text
C:\Forensics Image\android_image.afd\file_000.aff
```

I selected **Verify Drive/Image** to calculate the forensic hashes and check the image for bad blocks.

The verification process confirmed that:

- MD5 and SHA-1 hash values were successfully calculated.
- No bad blocks were reported.
- The image completed verification and was suitable for continued analysis in the lab.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c3ddfb07-5477-4d7e-8965-a6ae79cbccbc"
       alt="FTK Imager verification results for file_000 AFF showing calculated MD5 and SHA-1 values and no bad blocks"
       width="400">
</p>

<p align="center">
  <em>Figure 1: FTK Imager verification results showing calculated MD5 and SHA-1 hashes and no bad blocks in `file_000.aff`.</em>
</p>

---

### Why Integrity Verification Matters

A forensic image should remain unchanged throughout an investigation. Hash values provide a digital fingerprint that can be recorded and compared during later handling. Matching verification values support the integrity of the forensic copy, while the original evidence and verification records should still be preserved.

---

## Task 2: Convert the Image for Autopsy

For the workflow used in this lab, I converted the AFF image into an E01 evidence file with FTK Imager before loading it into Autopsy.

### Image Format Selection

| Format | Description |
|---|---|
| Raw (`dd`) | Exact uncompressed copy of the original evidence |
| SMART | Older image format associated with Linux and Unix systems |
| E01 | EnCase evidence format with metadata, compression, and image segmentation |
| AFF | Open-source Advanced Forensic Format |

I selected **E01** and entered the lab-provided case information.

The output was saved as:

```text
C:\Users\Administrator\Desktop\evidence.E01
```

<p align="center">
  <img src="https://github.com/user-attachments/assets/441094fa-78c4-476e-a6eb-acc38909f3dd"
       alt="FTK Imager image-creation results for the converted evidence E01 file"
       width="400">
</p>

<p align="center">
  <em>Figure 2: FTK Imager successfully converted the AFF source image into `evidence.E01`.</em>
</p>

---

## Task 3: Configure the Autopsy Case

I created a new Autopsy case with the following information:

```text
Case Name: 2023_11_09
Case Number: 12345
Examiner: Dontrell Wilson
Base Directory: Desktop
```

I added `evidence.E01` as a **Disk Image or VM File** and selected:

```text
Android Analyzer (aLEAPP)
```

as the ingest module.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a52cef3c-6e2a-4e4c-8e42-2dd77d42e05b"
       alt="Autopsy data-source configuration with evidence E01 and Android Analyzer aLEAPP enabled"
       width="400">
</p>

<p align="center">
  <em>Figure 3: The `evidence.E01` data source was added to Autopsy with Android Analyzer (aLEAPP) enabled.</em>
</p>

---

## Task 4: Analyze the Android File System

### Android Data Source

I navigated to:

```text
Data Sources
└── evidence.E01_Host
    └── evidence.E01
        └── android-9.0-r2
            └── data
```

The Android file system contained application directories, databases, downloaded files, and cached communication artifacts.

---

### Finding 1: Slack Application Data

I examined the Slack application directory:

```text
data
└── data
    └── com.Slack
        └── databases
            └── org_T064p4F0SRE-wal
```

The `-wal` extension identifies a SQLite write-ahead log. A WAL file can contain recently written database pages that have not yet been checkpointed into the primary database and may preserve information that is not visible when the main database is reviewed alone.

<p align="center">
  <img src="https://github.com/user-attachments/assets/f6e58155-4d4f-425b-abc6-264a1ee39469"
       alt="Autopsy displaying the Slack SQLite write-ahead log in the Android application database directory"
       width="800">
</p>

<p align="center">
  <em>Figure 4: The Slack `org_T064p4F0SRE-wal` file located in the Android application database directory.</em>
</p>

---

### Finding 2: Slack Direct Messages

I opened the Slack write-ahead log in a new window and reviewed the **Text → Strings** view.

The recovered JSON data included the following conversation:

```text
"Very nice. Tell me, do you have the stuff?"
"Yes of course. Should I send it through here or through email?"
"It might be better through here."
```

The messages showed two users discussing whether to send an unspecified item through Slack or email. The content was potentially relevant but did not identify the item by itself.

<p align="center">
  <img src="https://github.com/user-attachments/assets/26912313-e9af-4b7c-b206-666ed2d09e4d"
       alt="Autopsy Strings view displaying Slack direct-message content recovered from the write-ahead log"
       width="800">
</p>

<p align="center">
  <em>Figure 5: Slack direct messages recovered in JSON format from the application write-ahead log.</em>
</p>

---

### Finding 3: Shared File Reference

The Slack data also contained a reference to:

```text
secret.txt
```

The JSON artifact contained file-transfer metadata referencing `secret.txt` within the Slack activity.

I located the downloaded copy at:

```text
data
└── media
    └── 0
        └── Download
            └── secret.txt
```

---

### Finding 4: Recovered Plaintext Credentials

I extracted `secret.txt` to the desktop and opened it in Notepad.

The training file contained five plaintext username-and-password pairs:

- `admin:pYN70=]3yT|~`
- `lcook:uK+7M+5/51iw`
- `rjohnson:z"1Afnm6b2N2`
- `sturner:Hd4\2:99>f!9`
- `msmith:1U2.Idp&4Dtr`


<p align="center">
  <img src="https://github.com/user-attachments/assets/68484870-e17d-4343-b82d-f258d993d9cd"
       alt="Notepad displaying plaintext training credentials extracted from secret txt"
       width="800">
</p>

<p align="center">
  <em>Figure 6: The extracted `secret.txt` file containing multiple plaintext account credentials.</em>
</p>

#### Security Significance

The recovery of plaintext credentials represented a serious security weakness within the training scenario. Anyone with access to the file could attempt to use the exposed accounts. Credentials should be stored in an approved password manager or protected by appropriate cryptographic controls rather than kept in an unencrypted text file.

---

### Finding 5: Proton Mail Account Artifact

I navigated to:

```text
data
└── data
    └── ch.protonmail.android
        └── databases
            └── proton-mail.db
```

The Strings view of `proton-mail.db` contained the email address:

```text
jaydoe270@protonmail.com
```

<p align="center">
  <img src="https://github.com/user-attachments/assets/083852e0-0465-487f-93da-d620c5053a83"
       alt="Autopsy Strings view displaying the Proton Mail account jaydoe270 at protonmail"
       width="800">
</p>

<p align="center">
  <em>Figure 7: The Proton Mail database identified the account `jaydoe270@protonmail.com`.</em>
</p>

---

### Finding 6: PGP-Encrypted Messages

Additional strings in `proton-mail.db` contained PGP message blocks and signatures.

```text
-----BEGIN PGP MESSAGE-----
...
-----END PGP MESSAGE-----
```

The recovered message bodies could not be decrypted because the required private key was not available.

<p align="center">
  <img src="https://github.com/user-attachments/assets/ac82ae83-fa03-4ae5-9a60-ee413b8f15fe"
       alt="Autopsy Strings view displaying a PGP-formatted encrypted message block from proton-mail db"
       width="800">
</p>

<p align="center">
  <em>Figure 8: PGP-encrypted message content recovered from the Proton Mail database.</em>
</p>

#### Forensic Significance

Encryption prevented direct review of the message contents, but the artifacts still documented the presence of Proton Mail account data and PGP-formatted message blocks. The account identifier, timestamps, message blocks, and related metadata could be correlated with other evidence.

---

## Task 5: Generate and Analyze the Report

I generated an **HTML Report** in Autopsy and selected:

```text
Data Source: evidence.E01
Report Scope: All Results
```

The report organized the recovered Android artifacts into categories for review outside the main Autopsy interface.

---

### Finding 7: Web History

The report contained:

```text
18 web-history records
```

The browsing history included references to:

- Google
- APKPure
- Slack
- Proton Mail

<p align="center">
   <img src="https://github.com/user-attachments/assets/1da8b50f-eee6-4d70-a842-62decb4ed445"
       alt="Autopsy HTML report displaying 18 recovered web-history records"
       width="600">
</p>

<p align="center">
  <em>Figure 9: The Autopsy HTML report displayed 18 recovered web-history records.</em>
</p>

---

### Finding 8: Web Searches

The report contained:

```text
7 web-search records
```

Recovered searches included:

- `apk pure`
- `protonmail apkpure`
- `slack`
- `slack sign in`

<p align="center">
  <img src="https://github.com/user-attachments/assets/7f114019-ea70-44bc-87ba-39bf53e5683d"
       alt="Autopsy HTML report displaying seven recovered web-search records"
       width="600">
</p>

<p align="center">
  <em>Figure 10: The Autopsy HTML report displayed seven recovered web-search records.</em>
</p>

---

### Finding 9: Installed Applications

The report identified:

```text
15 installed-program records
```

Relevant applications included:

- Proton Mail
- Slack
- Chrome
- Gmail
- Google Mobile Services

<p align="center">
  <img src="https://github.com/user-attachments/assets/0c8a110e-3a6e-48d0-8dae-bae13a650a59"
       alt="Autopsy HTML report displaying installed Android applications including Proton Mail and Slack"
       width="900">
</p>

<p align="center">
  <em>Figure 11: The report displayed installed Android applications, including Proton Mail and Slack.</em>
</p>

---

## Evidence Summary

| Evidence Source | Artifact | Finding | Significance |
|---|---|---|---|
| `file_000.aff` | Integrity verification | MD5 and SHA-1 values calculated; no bad blocks reported | Supports the integrity of the examined forensic image at the time of verification |
| `evidence.E01` | Converted forensic image | AFF evidence successfully converted to E01 | Created a working image for the Autopsy workflow while preserving the original AFF source |
| `org_T064p4F0SRE-wal` | Slack write-ahead log | Direct-message content recovered in JSON-format strings | Preserved application activity not reviewed through the primary database alone |
| Slack JSON data | File-transfer metadata | Reference to `secret.txt` | Connected the downloaded file to Slack-related activity |
| `secret.txt` | Downloaded text file | Five plaintext credential pairs | Indicates insecure credential storage |
| `proton-mail.db` | Account artifact | `jaydoe270@protonmail.com` | Identified an email account |
| `proton-mail.db` | PGP-formatted blocks | Encrypted message artifacts and signatures | Documented PGP-protected communication artifacts without revealing plaintext |
| HTML report | Web History | 18 records | Documented browsing activity |
| HTML report | Web Search | 7 records | Documented user search activity |
| HTML report | Installed Programs | 15 records | Identified applications present on the device |

---

## Investigative Conclusions

The forensic image completed integrity verification and was successfully converted from AFF to E01 for the Autopsy workflow. Examination of the Android file system recovered Slack message artifacts, a shared-file reference, plaintext training credentials, a Proton Mail account identifier, and PGP-formatted email artifacts.

The Slack write-ahead log showed communication about sending an unspecified item through Slack or email. The linked `secret.txt` file exposed multiple account credentials in plaintext. Proton Mail artifacts documented an account identifier and encrypted message blocks associated with the application.

The final Autopsy report organized these findings alongside the device’s web history, searches, and installed applications. Together, the artifacts demonstrated how application databases, write-ahead logs, downloaded content, and generated reports can support reconstruction of activity on an Android device.

---

## Key Takeaways

- Hash verification should be completed before evidence analysis.
- Converting an image format does not replace the need to preserve the original image.
- SQLite write-ahead logs may contain recent database pages that are not yet present in the primary database.
- Application JSON data can reveal messages and file transfers.
- Download folders may contain files referenced in communication artifacts.
- Plaintext credential storage creates a serious security risk.
- Encrypted content may remain unreadable without the required key, but related account and message metadata can still be valuable.
- A forensic report provides a structured summary of recovered artifacts.

---

> **Ethical Use Notice:** This repository documents an authorized educational forensic investigation. Digital evidence should only be acquired and analyzed with proper legal authority or explicit permission.
