# Complete Project Narrative – Windows XP DFIR Investigation

## Project Overview

This project was designed as a full Digital Forensics and Incident Response (DFIR) investigation using publicly available forensic datasets. The original objective was to simulate a real-world cyber incident investigation by analyzing memory, disk, network, and executable artifacts in order to identify evidence of malicious activity, extract Indicators of Compromise (IOCs), and document findings using professional forensic methodologies.

The project was performed in a virtualized laboratory environment using VMware Workstation, Windows 10, and REMnux. Throughout the investigation, industry-standard DFIR tools such as Volatility 3, Autopsy, Wireshark, PE Studio, and YARA were utilized.

Although the original project plan included extensive malware analysis and dynamic analysis activities, several adjustments were made during execution because of hardware limitations, virtual machine performance issues, limited storage availability, and time constraints. Rather than abandoning the project, the investigation scope was adapted while maintaining forensic accuracy and demonstrating the intended DFIR workflows.

| Category | Details |
|-----------|---------|
| Project Name | Windows XP DFIR Investigation |
| Investigation Type | Digital Forensics & Incident Response (DFIR) |
| Dataset | Windows XP Forensic Dataset |
| Evidence Types | Memory Image, Disk Image, Packet Capture |
| Analysis Environment | VMware Workstation, Windows 10, REMnux |
| Primary Tools | Volatility 3, Autopsy, Wireshark, PE Studio, YARA |
| Investigation Phases | 9 |
| Final Outcome | No confirmed malware identified |
| Deliverables | Investigation Report, YARA Rule, IOC Worksheet, ATT&CK Mapping |


---

# Project Objectives

The primary goals of the project were:

* Build a functional DFIR laboratory environment.
* Analyze memory artifacts from a Windows XP system.
* Investigate disk artifacts using forensic software.
* Review network traffic captured from the target system.
* Perform static executable analysis.
* Create a YARA detection rule.
* Extract Indicators of Compromise (IOCs).
* Map findings to MITRE ATT&CK techniques.
* Produce a professional forensic investigation report.

---

# Phase 1 – Laboratory Environment Setup

## Objective

Before any forensic analysis could begin, an isolated and controlled laboratory environment was required.

The lab was designed to allow forensic investigation without affecting the host operating system.

| Component | Purpose |
|------------|---------|
| VMware Workstation | Virtualization Platform |
| Windows 10 VM | Forensic Analysis Workstation |
| REMnux VM | Linux Forensic Workstation |
| Host-Only Network | Isolated Analysis Environment |
| Snapshots | Environment Recovery & Rollback |
| Evidence Storage | Organized Investigation Artifacts |

---

## Tools Used

* VMware Workstation
* Windows 10 Virtual Machine
* REMnux Linux Distribution
* Virtual Networking

---

## Activities Performed

### VMware Configuration

A virtual environment was created using VMware Workstation.

Tasks included:

* Importing the REMnux virtual appliance
* Configuring Windows 10 virtual machine
* Allocating memory and storage resources
* Creating baseline snapshots
* Configuring networking

---

### Network Configuration

A host-only network was configured to isolate forensic systems from the internet.

This allowed:

* Controlled communication
* Safe malware-related experimentation
* Network traffic monitoring

Connectivity was verified through:

* IP address verification
* Ping testing between systems

---

### Windows 10 Preparation

The Windows 10 VM was configured as the primary forensic workstation.

Activities included:

* Static IP configuration
* Windows Defender modifications
* Windows Update configuration
* Tool installation

---

### REMnux Preparation

REMnux served as the Linux-based forensic workstation.

Tasks included:

* Verifying forensic tool availability
* Preparing evidence directories
* Organizing analysis workspace

---

## Outcome

A functional DFIR lab environment was successfully created.

All required systems were able to communicate and were prepared for evidence analysis.

---

# Phase 2 – Evidence Acquisition and Preparation

## Objective

Prepare forensic evidence for investigation.

---

## Evidence Used

### Memory Image

Windows XP memory image (.vmem)

### Disk Image

EnCase forensic image (.E01)

### Network Capture

Packet capture file (.pcap)

---

## Activities Performed

* Downloaded forensic datasets
* Organized evidence folders
* Verified evidence availability
* Imported evidence into analysis systems

Evidence was structured into dedicated directories for:

* Memory analysis
* Disk analysis
* Network analysis
* Static analysis
* Reporting

---

## Outcome

All evidence was successfully prepared for forensic analysis.

---

# Phase 3 – Memory Forensics

## Objective

Analyze volatile memory artifacts to identify suspicious processes, injected code, hidden processes, and system activity.

---

## Tool Used

Volatility 3

---

## Analysis Performed

### System Information

Volatility identified:

* Windows XP SP3
* 32-bit architecture
* Memory acquisition details

---

### Process Enumeration

The pslist plugin was used.

Observed processes included:

* firefox.exe
* thunderbird.exe
* cmd.exe
* mdd_1.3.exe

---

### Hidden Process Detection

The psscan plugin was used.

Results showed:

* No hidden processes
* No DKOM-style process hiding

---

### Command-Line Analysis

Command-line parameters were reviewed.

Findings:

* Standard Firefox execution
* Standard Thunderbird execution
* Memory acquisition utility execution

No suspicious command execution was identified.

---

### DLL Analysis

DLL loading locations were reviewed.

Results:

* No suspicious DLL loading
* No temporary-directory DLL execution
* Thunderbird profile DLLs appeared legitimate

---

### Registry Hive Analysis

Registry hives recovered included:

* SYSTEM
* SOFTWARE
* SAM
* SECURITY
* DEFAULT
* NTUSER.DAT

---

### Malfind Analysis

Volatility's malfind plugin identified executable memory regions.

Initially these appeared suspicious.

Further review revealed:

* No MZ headers
* No confirmed injected executables
* Findings consistent with Windows XP behavior

---

## Outcome

No definitive evidence of malware execution or process injection was identified within memory artifacts.

---

# Phase 4 – Disk Forensics

## Objective

Investigate persistent system artifacts and user activity.

---

## Tool Used

Autopsy

---

## Activities Performed

### Installed Program Analysis

Programs identified:

* Firefox
* Thunderbird
* OpenOffice
* Java Runtime Environment

---

### Web Downloads Analysis

Recovered download artifacts included:

* Python installer
* Thunderbird installer
* OpenOffice installer
* Additional executable downloads

---

### Interesting Items Analysis

Autopsy identified:

* Remote monitoring artifacts
* Atera-related entries

These were documented but not confirmed as malicious.

---

### Extension Mismatch Analysis

Autopsy identified multiple extension mismatches.

Investigation revealed:

* Configuration files
* Recovery files
* Application databases

No disguised malware was identified.

---

### Run Programs Analysis

Startup and execution artifacts were reviewed.

Results:

* AVG Antivirus activity observed
* Browser execution identified
* No suspicious startup mechanisms detected

---

### USB Analysis

Artifacts indicated:

* Mouse
* Keyboard

No USB storage devices were identified.

---

### Deleted File Analysis

Over one thousand deleted file entries were reviewed.

Findings primarily consisted of:

* Temporary files
* Application files
* Installer artifacts

No confirmed malware payloads were identified.

---

### Web History Analysis

Browsing activity included:

* Microsoft
* Mozilla
* OpenOffice
* Dell
* Update-related websites

No confirmed malicious domains were identified.

---

## Outcome

Disk analysis primarily reflected normal workstation activity.

No confirmed indicators of compromise were identified.

---

# Phase 5 – Network Forensics

## Objective

Analyze network communications for suspicious activity.

---

## Tool Used

Wireshark

---

## Activities Performed

### DNS Analysis

DNS traffic was reviewed.

Observed domains included:

* microsoft.com
* officeclient.microsoft.com
* msftncsi.com
* lafontainebleu.org

No DGA behavior was observed.

---

### HTTP Analysis

HTTP communications were reviewed.

Findings included:

* Microsoft connectivity checks
* HTTP GET requests
* HTTP POST requests

---

### POST Request Analysis

Three POST requests were identified.

Although potentially interesting, packet review did not provide sufficient evidence to classify them as malicious.

---

### Conversation Analysis

Network conversations were reviewed to identify:

* Beaconing
* Command and Control
* Repeated communications

No confirmed beaconing behavior was identified.

---

## Outcome

Network traffic appeared largely consistent with normal application activity.

No confirmed command-and-control communications were identified.

---

# Phase 6 – Static Analysis

## Original Plan

The original project intended to perform static analysis on malware samples extracted from forensic artifacts.

---

## Challenge Encountered

During execution:

* No confirmed malware sample was recovered.
* Hardware limitations complicated extended analysis.
* Time constraints required adapting the workflow.

---

## Adaptation

To demonstrate the static analysis process, a legitimate executable (Wireshark.exe) was analyzed.

This allowed demonstration of:

* Hash generation
* PE Studio usage
* File metadata review
* Entropy analysis

without falsely claiming malware findings.

---

## Tools Used

* PE Studio
* Certutil

---

## Activities Performed

### SHA256 Generation

File integrity was verified.

### MD5 Generation

Additional hash generation was performed.

### PE Studio Analysis

Reviewed:

* File metadata
* Indicators
* PE structure
* Entropy values

---

## Outcome

The executable appeared legitimate.

No malicious indicators were identified.

---

# Phase 7 – YARA Rule Development

## Objective

Demonstrate signature-based detection development.

---

## Activities Performed

* Created custom YARA rule
* Validated syntax
* Documented rule structure

---

## Adaptation

Because no malware sample was confirmed during investigation, the YARA phase focused on demonstrating workflow rather than producing a real-world malware detection signature.

---

## Outcome

Custom YARA rule successfully created and documented.

---

# Phase 8 – IOC Extraction

## Objective

Document observable indicators discovered during investigation.

---

## IOCs Collected

### File Hashes

* SHA256 hash
* MD5 hash

### IP Addresses

* 10.8.15.133
* 72.5.43.29
* 23.205.110.48

### Domains

* lafontainebleu.org
* python.org

### Processes

* firefox.exe
* thunderbird.exe
* cmd.exe
* mdd_1.3.exe

---

## Outcome

IOC worksheet successfully completed.

---

# Phase 9 – MITRE ATT&CK Mapping

Findings were mapped to applicable ATT&CK techniques.

Examples:

* T1071.001 – Web Protocols
* T1071.004 – DNS
* T1204.002 – User Execution
* T1027 – Obfuscated/Compressed Files

Only techniques supported by evidence were documented.

---

# Major Challenges Encountered

## Hardware Limitations

Challenges included:

* Limited RAM
* Limited storage
* Slow VM performance

---

## Time Constraints

The project needed to be completed within a short timeframe.

This required prioritizing:

* Evidence review
* Documentation
* Core forensic workflows

---

## Tool Compatibility Issues

Examples:

* Windows XP limitations
* Unsupported Volatility network plugins
* VM performance degradation

---

# Key Skills Demonstrated

* Digital Forensics
* Incident Response
* Memory Forensics
* Disk Forensics
* Network Analysis
* Static Analysis
* IOC Extraction
* YARA Development
* MITRE ATT&CK Mapping
* Evidence Handling
* Technical Documentation
* Forensic Reporting

| Skill Category | Technologies / Concepts |
|---------------|-------------------------|
| Memory Forensics | Volatility 3, Process Analysis |
| Disk Forensics | Autopsy, Artifact Recovery |
| Network Analysis | Wireshark, DNS & HTTP Analysis |
| Static Analysis | PE Studio, Hash Verification |
| Detection Engineering | YARA Rule Development |
| Threat Intelligence | IOC Documentation |
| ATT&CK Mapping | Adversary Technique Classification |
| Reporting | Professional Documentation |

---

# Final Result

The investigation successfully demonstrated the complete DFIR workflow from evidence preparation through final reporting.

While no definitive malware infection was identified, the project achieved its primary educational objective of providing practical experience with forensic tools, investigation methodology, evidence handling, artifact analysis, IOC documentation, and professional reporting.

## 🏆 Final Deliverables

| Deliverable | Status |
|------------|---------|
| Investigation Report | Completed |
| Memory Analysis Documentation | Completed |
| Disk Analysis Documentation | Completed |
| Network Analysis Documentation | Completed |
| Static Analysis Documentation | Completed |   
| YARA Rule | Completed |
| IOC Worksheet | Completed |
| MITRE ATT&CK Mapping | Completed |
| GitHub Repository | Completed |

Most importantly, the project demonstrated the ability to adapt an investigation based on available resources while maintaining forensic accuracy and evidence-based conclusions.
