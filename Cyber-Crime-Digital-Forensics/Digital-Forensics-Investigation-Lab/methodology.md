# Investigation Methodology — Case LAB-2024-001

## Windows XP DFIR Investigation

---

## Overview

This document describes the step-by-step methodology applied throughout the DFIR investigation of Windows XP forensic dataset LAB-2024-001. Each phase is documented with its objective, tools used, specific activities performed, evidence collected, findings observed, and outcome reached.

This methodology follows the standard DFIR investigative framework:

**Identify → Preserve → Collect → Analyze → Document → Report**

---

## Phase 1 — Laboratory Environment Setup

### Objective
Establish a controlled, isolated virtual laboratory environment capable of supporting full DFIR investigation activities without exposing the host system or production network to risk.

### Tools Used
- VMware Workstation
- Windows 10 Virtual Machine
- REMnux Linux v2 Virtual Appliance

### Activities Performed

**VMware Configuration**
- Imported REMnux virtual appliance into VMware Workstation
- Configured Windows 10 virtual machine with adequate CPU, RAM, and storage allocation
- Created pre-investigation baseline snapshots for both VMs

**Network Configuration**
- Configured host-only virtual network to isolate laboratory from internet and production environment
- Assigned static IP addresses to both VMs
- Verified bidirectional connectivity using ICMP ping testing between Windows 10 and REMnux

**Windows 10 Preparation**
- Configured static IP address
- Adjusted Windows Defender settings to allow forensic tool operation
- Disabled Windows Update to prevent environment changes during investigation
- Installed: Autopsy, FTK Imager, PE Studio, FLOSS, Wireshark, Npcap, Process Monitor, Velociraptor, 7-Zip

**REMnux Preparation**
- Verified availability of pre-installed forensic tools: Volatility 3, YARA, Wireshark, strings
- Created organized evidence directory structure under `/cases/LAB-2024-001/`
- Verified network reachability to Windows 10 VM

### Evidence Collected
- Screenshots: VM configurations, IP verification, ping tests, tool installation confirmations, network configuration, baseline snapshots

### Findings
- Functional dual-VM isolated DFIR lab established
- All required tools verified and operational prior to evidence loading

### Outcome
Complete laboratory environment ready for forensic investigation. Both VMs communicating successfully within isolated network. Baseline snapshots preserved for rollback capability.

---

## Phase 2 — Evidence Acquisition and Preparation

### Objective
Acquire forensic datasets, verify integrity, and organize evidence for analysis.

### Tools Used
- Web browser (Digital Corpora download)
- Certutil (SHA-256/MD5 hash verification)
- File system (evidence directory organization)

### Activities Performed

**Evidence Download**
- Downloaded Windows XP forensic dataset from Digital Corpora
- Dataset components: `seized.vmem` (memory image), `seized.E01` (disk image), `capture.pcap` (network capture)

**Evidence Organization**
Evidence organized into a structured directory layout:
```
/cases/LAB-2024-001/
├── memory/      → seized.vmem
├── disk/        → seized.E01
├── network/     → capture.pcap
├── static/      → executables for analysis
└── reports/     → investigation documentation
```

**Integrity Verification**
- SHA-256 and MD5 hashes generated for all evidence items using Certutil
- Hashes documented prior to analysis commencement
- Evidence treated as read-only throughout investigation

**Evidence Import**
- Memory image transferred to REMnux for Volatility 3 analysis
- Disk image prepared for Autopsy import on Windows 10
- PCAP file loaded into Wireshark on REMnux

### Evidence Collected
- Screenshots: evidence download, directory structure, hash verification, evidence import confirmation

### Findings
- All three evidence items successfully acquired and organized
- Hash values recorded for chain-of-custody documentation

### Outcome
Evidence ready for forensic analysis. Integrity baseline established.

---

## Phase 3 — Memory Forensics

### Objective
Analyze volatile memory to identify active processes, command-line activity, hidden processes, memory injection indicators, DLL load paths, and registry hive structure.

### Tools Used
- Volatility 3 (on REMnux)

### Evidence File
`seized.vmem` — Windows XP SP3 memory image

### Activities Performed

**System Profile Identification**
Plugin: `windows.info`
- Identified: Windows XP SP3, 32-bit architecture, 2 processors, memory captured 2009-12-04 00:37:49 UTC

**Process Enumeration**
Plugin: `windows.pslist`
- Enumerated all processes from the active process list (EPROCESS linked list)
- Notable processes: `firefox.exe` (PID 2684), `thunderbird.exe` (PID 764), `cmd.exe` (PID 3124), `mdd_1.3.exe` (PID 3336)

**Hidden Process Detection**
Plugin: `windows.psscan`
- Scanned physical memory for EPROCESS structures regardless of list linkage
- Compared pslist and psscan outputs to detect unlinked (hidden) processes
- Result: No hidden processes identified; no DKOM-style manipulation detected

**Command-Line Analysis**
Plugin: `windows.cmdline`
- Reviewed command-line arguments for all noteworthy processes
- `cmd.exe` — standard command prompt, no suspicious arguments
- `firefox.exe` — standard browser launch from Program Files
- `thunderbird.exe` — launched with `-mail` parameter (normal behavior)
- `mdd_1.3.exe` — command: `Z:\mdd_1.3.exe -o z:\charlie-2009-12-03.ram` (confirms memory acquisition activity)

**DLL Analysis**
Plugin: `windows.dlllist`
- Reviewed DLL load paths for suspicious loading locations
- No DLLs loaded from Temp, AppData, or other anomalous directories
- Thunderbird loaded components from user profile path — consistent with normal behavior

**Registry Hive Identification**
Plugin: `windows.registry.hivelist`
- Identified hives: SYSTEM, SOFTWARE, SAM, SECURITY, DEFAULT
- User hives: Charlie (NTUSER.DAT), LocalService (NTUSER.DAT), NetworkService (NTUSER.DAT)

**Memory Injection Detection**
Plugin: `windows.malfind`
- Identified PAGE_EXECUTE_READWRITE (RWX) memory regions in multiple processes
- Affected processes: `csrss.exe`, `winlogon.exe`, `lsass.exe`, `AVGIDSAgent.exe`, `avgwdsvc.exe`, `avgtray.exe`, `soffice.bin`, `firefox.exe`
- No MZ headers identified within flagged regions
- Findings assessed as inconclusive given Windows XP + active AV environment

> **Note:** Volatility 3's `netscan` plugin does not support Windows XP SP3. Network connection artifacts could not be extracted from memory. Network analysis was instead performed via the accompanying PCAP.

### Evidence Collected
- Screenshots: system profile output, process enumeration, psscan comparison, cmdline output, malfind output, DLL listing, registry hivelist

### Findings
- Windows XP SP3 system confirmed
- Four noteworthy processes identified; all consistent with normal user activity
- No hidden processes or DKOM manipulation detected
- No confirmed process injection or PE injection from malfind results
- All registry hives successfully identified

### Outcome
Memory forensics completed. No definitive indicators of malware activity identified within memory artifacts.

---

## Phase 4 — Disk Forensics

### Objective
Examine persistent disk artifacts to identify installed software, user activity, deleted content, browser history, and USB device usage.

### Tools Used
- Autopsy (on Windows 10)

### Evidence File
`seized.E01` — EnCase forensic disk image

### Activities Performed

**Evidence Import**
- Disk image added to Autopsy as a new data source
- Autopsy ingest modules initiated (note: ingest did not reach 100% within investigation window)

**Installed Programs Analysis**
- Reviewed installed application artifacts
- Identified: Mozilla Firefox, Mozilla Thunderbird, OpenOffice productivity suite, AVG Antivirus, Adobe Reader, Java Runtime Environment

**Web Downloads Analysis**
- Reviewed download artifacts from browser history
- Recovered: Python installer download record (`http://www.python.org/ftp/python/2.6.4/python-2.6...`), Thunderbird installer, OpenOffice installer, additional executable download records

**Interesting Items Review**
- Autopsy flagged remote monitoring artifacts including Atera-related entries
- Documented as notable; could not be confirmed as malicious within investigation scope

**Extension Mismatch Analysis**
- Autopsy identified multiple files with mismatched extensions
- Review revealed: configuration files, recovery data, application databases
- No disguised malware executables identified

**Run Programs Analysis**
- Reviewed recently executed program artifacts
- Identified: AVG Antivirus activity, browser execution, standard system tools
- No suspicious startup mechanisms or unauthorized scheduled executions detected

**USB Device Analysis**
- Reviewed USB connection artifacts
- Identified: standard HID devices (mouse, keyboard)
- No USB mass storage devices connected — no external data transfer evidence

**Deleted File Recovery**
- Reviewed 1,000+ deleted file entries
- Content primarily: temporary files, application installers, browser cache artifacts
- No confirmed malware payloads recovered from deleted file space

**Web History Analysis**
- Reviewed browser history artifacts
- Domains visited: Microsoft, Mozilla, OpenOffice, Dell, software update services
- No confirmed malicious domains identified in browsing history

### Evidence Collected
- Screenshots: Autopsy evidence import, installed programs output, web downloads, interesting items, extension mismatches, run programs, USB artifacts, deleted files overview, deleted file recovery evidence, web history

### Findings
- Normal workstation usage pattern across all artifact categories
- No malware executables, unauthorized persistence mechanisms, or suspicious startup entries identified
- Remote monitoring artifacts (Atera) noted but unconfirmed as malicious
- No USB data exfiltration evidence

### Outcome
Disk analysis completed. Artifact profile consistent with normal workstation activity. No confirmed IOCs identified from disk evidence.

---

## Phase 5 — Network Forensics

### Objective
Analyze network packet capture to identify suspicious communications, domain queries, beaconing activity, and extract observable network indicators.

### Tools Used
- Wireshark (on REMnux and Windows 10)

### Evidence File
`capture.pcap` — network packet capture

### Activities Performed

**PCAP Loading and Initial Review**
- Loaded capture.pcap into Wireshark
- Reviewed capture summary statistics (packet count, protocol distribution, capture duration)

**DNS Traffic Analysis**
- Applied DNS display filter: `dns`
- Reviewed all domain name queries
- Observed domains: `microsoft.com`, `officeclient.microsoft.com`, `msftncsi.com` (Windows connectivity check), `lafontainebleu.org`
- No Domain Generation Algorithm (DGA) patterns identified
- `lafontainebleu.org` documented as notable — queried during capture period

**HTTP Traffic Analysis**
- Applied HTTP display filter: `http`
- Reviewed HTTP GET and POST requests
- Microsoft connectivity check traffic observed (normal Windows behavior)
- Outbound HTTP traffic to external IP addresses documented

**HTTP POST Request Analysis**
- Three HTTP POST requests identified, directed to IP `72.5.43.29`
- Packet content reviewed; insufficient evidence to classify as malicious C2 traffic
- Documented as observable network indicator

**Network Conversation Analysis**
- Used Wireshark Statistics → Conversations menu
- Reviewed TCP/IP conversation pairs for beaconing or repetitive connection patterns
- No confirmed beaconing behavior identified
- Conversation endpoints documented for IOC worksheet

### Evidence Collected
- Screenshots: PCAP loading, DNS traffic analysis, HTTP traffic analysis, HTTP POST request detail, conversation analysis

### Findings
- DNS traffic consistent with normal Windows and application behavior
- HTTP communications appeared largely routine
- Three HTTP POST requests to `72.5.43.29` noted — inconclusive
- `lafontainebleu.org` DNS queries documented as notable observable indicator
- No confirmed C2 communications or beaconing patterns

### Outcome
Network forensics completed. Observable network indicators extracted and documented. No confirmed command-and-control activity identified.

---

## Phase 6 — Static Analysis

### Objective
Perform static analysis on an executable artifact to demonstrate PE analysis methodology including hash verification, metadata review, PE structure examination, and entropy analysis.

### Tools Used
- PE Studio (on Windows 10)
- Certutil (hash generation)

### Scope Adaptation
No confirmed malware sample was recovered from the forensic dataset. To demonstrate static analysis methodology without fabricating findings, `Wireshark.exe` (v4.6.8) was analyzed as a clearly documented legitimate executable. This decision is transparently documented throughout the investigation.

### Activities Performed

**Hash Generation**
- SHA-256 generated using: `certutil -hashfile Wireshark.exe SHA256`
  - Result: `99DC13045CC75BA9FEAEB8E9C56A1BE0E2C22DEAC15B474A435469B33E6D76B1`
- MD5 generated using: `certutil -hashfile Wireshark.exe MD5`
  - Result: `5DD9D2DB30F70063BFCAB99450417CE4`

**PE Studio Analysis**
- File type: 64-bit Portable Executable (PE)
- File size: 18,667,688 bytes (18.6 MB)
- Version: 4.6.8
- File description: Wireshark
- Original filename: Wireshark.exe

**PE Structure Review**
- Valid PE structure confirmed
- GUI application (subsystem: Windows GUI)
- Imports, exports, and sections reviewed
- No suspicious API imports (process injection, credential access, persistence APIs) identified

**Entropy Analysis**
- Entropy value: 7.327
- Indicates compressed/packed sections — common in legitimate software distributables
- Elevated entropy alone does not indicate malicious packing

**Certificate Analysis**
- PE Studio identified an expired certificate associated with the executable
- Expired certificate noted; does not independently constitute evidence of malicious activity

**Zone Identifier Analysis**
- Zone Identifier artifact examined — documents file download origin
- Consistent with standard web download behavior

### Evidence Collected
- Screenshots: SHA-256 hash generation, MD5 hash generation, PE Studio analysis view, zone identifier artifact

### Findings
- Legitimate executable confirmed; no malicious indicators identified
- Entropy elevated (7.327) — consistent with compressed installer, not confirmed obfuscation
- No suspicious imports, network indicators, mutex names, or persistence APIs identified

### Outcome
Static analysis methodology demonstrated using legitimate executable. Findings documented with transparent scope disclosure.

---

## Phase 7 — YARA Rule Development

### Objective
Develop a custom YARA detection rule to demonstrate signature-based detection engineering methodology.

### Tools Used
- Text editor (rule authoring)
- YARA (on REMnux, syntax validation)

### Activities Performed

**String Identification**
- Identified strings during Phase 6 static analysis: `"Wireshark"`, `"WiresharkDevelopmentTeam"`

**Rule Authoring**
Developed the following rule:

```yara
rule LAB001_Malware_Detection
{
    meta:
        author = "Dhruvi Desai"
        date = "2026-05-29"
        description = "Demonstration YARA rule created during DFIR lab project"
        case = "LAB-2024-001"

    strings:
        $mz = "MZ"
        $ws1 = "Wireshark"
        $ws2 = "WiresharkDevelopmentTeam"

    condition:
        uint16(0) == 0x5A4D
        and any of ($ws*)
}
```

**Rule Validation**
- Rule syntax reviewed
- Logic walkthrough: rule matches files that begin with a valid PE MZ header AND contain at least one of the Wireshark-related strings

**Scope Note**
Because no confirmed malware sample was available, this YARA rule demonstrates the detection engineering workflow and rule structure rather than providing an operational malware signature. A production rule would be built from malware-specific strings, byte patterns, or behavioral indicators.

### Evidence Collected
- Screenshot: YARA rule creation

### Findings
- YARA rule successfully authored and validated

### Outcome
YARA detection rule created. Detection engineering methodology demonstrated.

---

## Phase 8 — IOC Extraction

### Objective
Consolidate and document all observable Indicators of Compromise identified across all investigation phases.

### Activities Performed
- Reviewed findings from all preceding phases
- Extracted all observable indicators into structured IOC worksheet
- Categorized by indicator type: file hashes, IP addresses, domains, URLs, processes
- Documented context for each indicator

### IOCs Extracted

| Type | Indicator | Source Phase |
|---|---|---|
| SHA-256 | `99DC13045CC75BA9FEAEB8E9C56A1BE0E2C22DEAC15B474A435469B33E6D76B1` | Static Analysis |
| MD5 | `5DD9D2DB30F70063BFCAB99450417CE4` | Static Analysis |
| IP | `10.8.15.133` | Network Forensics |
| IP | `72.5.43.29` | Network Forensics |
| IP | `23.205.110.48` | Network Forensics |
| Domain | `lafontainebleu.org` | Network Forensics |
| Domain | `www.python.org` | Disk Forensics |
| URL | `http://www.python.org/ftp/python/2.6.4/python-2.6...` | Disk Forensics |
| Process | `firefox.exe` (PID 2684) | Memory Forensics |
| Process | `thunderbird.exe` (PID 764) | Memory Forensics |
| Process | `cmd.exe` (PID 3124) | Memory Forensics |
| Process | `mdd_1.3.exe` (PID 3336) | Memory Forensics |

### Outcome
Structured IOC worksheet completed. See [ioc_worksheet.md](ioc_worksheet.md) for full documentation.

---

## Phase 9 — MITRE ATT&CK Mapping

### Objective
Map evidence-supported findings to applicable MITRE ATT&CK Enterprise techniques, documenting only those techniques directly corroborated by forensic evidence.

### Activities Performed
- Reviewed all collected evidence and findings
- Evaluated each candidate ATT&CK technique against available evidence
- Documented evidence basis for each mapped technique
- Explicitly documented techniques reviewed but not supported by evidence

### Techniques Mapped

| ID | Name | Evidence Basis |
|---|---|---|
| T1071.001 | Application Layer Protocol: Web Protocols | HTTP GET/POST traffic — Wireshark |
| T1071.004 | Application Layer Protocol: DNS | DNS queries including `lafontainebleu.org` — Wireshark |
| T1204.002 | User Execution | Web download artifacts — Autopsy |
| T1027 | Obfuscated Files or Information | Entropy 7.327 — PE Studio (inconclusive) |

### Techniques Reviewed — Not Evidenced

| ID | Name | Reason Not Mapped |
|---|---|---|
| T1055 | Process Injection | No injected PE headers confirmed by malfind |
| T1055.012 | Process Hollowing | No hollow process structures identified |
| T1547.001 | Registry Run Keys / Startup Folder | No suspicious persistence artifacts found |
| T1053.005 | Scheduled Task/Job | No scheduled task artifacts identified |
| T1003 | OS Credential Dumping | No credential dumping tools or artifacts found |

### Outcome
Evidence-supported ATT&CK mapping completed. See [mitre_mapping.md](mitre_mapping.md) for full documentation.

---

*Case: LAB-2024-001 | Analyst: Dhruvi Desai | Completed: May 2026*
