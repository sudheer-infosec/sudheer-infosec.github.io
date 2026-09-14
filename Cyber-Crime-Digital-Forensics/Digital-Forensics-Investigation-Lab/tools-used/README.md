# 🛠️ Tools Used & Configuration Notes

## Overview

This project utilized a collection of industry-standard Digital Forensics and Incident Response (DFIR) tools to perform memory analysis, disk forensics, network investigation, malware analysis, and detection engineering.

The laboratory environment was intentionally isolated to ensure safe handling of forensic evidence and executable samples.

---

## 🖥️ Laboratory Environment

| Component       | Details                              |
| --------------- | ------------------------------------ |
| Hypervisor      | VMware Workstation                   |
| Analysis VM     | REMnux Linux                         |
| Victim VM       | Windows 10                           |
| Network Mode    | Host-Only Isolated Network           |
| Snapshots       | Used before investigation activities |
| Internet Access | Restricted during malware analysis   |

---

## 🔧 Tool Inventory

| Tool               | Category                | Purpose                              |
| ------------------ | ----------------------- | ------------------------------------ |
| Volatility 3       | Memory Forensics        | Analyze RAM images                   |
| Autopsy            | Disk Forensics          | Investigate file system artifacts    |
| FTK Imager         | Evidence Acquisition    | Memory capture and evidence handling |
| Wireshark          | Network Analysis        | Packet inspection and traffic review |
| PE Studio          | Static Malware Analysis | Executable assessment                |
| CertUtil           | Hash Verification       | MD5 and SHA256 generation            |
| YARA               | Detection Engineering   | Malware detection signatures         |
| VMware Workstation | Virtualization          | Isolated investigation environment   |

---

## 🔬 Volatility 3

### Purpose

Used to analyze memory evidence and identify system information, running processes, and potentially suspicious activity.

### Investigation Tasks

| Activity                   | Purpose                         |
| -------------------------- | ------------------------------- |
| windows.info               | Operating system identification |
| Process Enumeration        | Active process review           |
| DLL Analysis               | Loaded module inspection        |
| Memory Artifact Collection | Evidence extraction             |

### Outcome

Successfully identified operating system information and memory-resident artifacts from captured evidence.

---

## 💾 Autopsy

### Purpose

Used for forensic examination of disk-based evidence.

### Investigation Tasks

| Activity                | Purpose                      |
| ----------------------- | ---------------------------- |
| File System Review      | Directory structure analysis |
| Deleted File Analysis   | Recovery opportunities       |
| Browser Artifact Review | User activity investigation  |
| USB Artifact Analysis   | Device connection history    |

### Outcome

Recovered multiple artifacts including browser history, downloads, deleted files, and connected USB device information.

---

## 🌐 Wireshark

### Purpose

Used to inspect packet capture data and identify network activity.

### Investigation Tasks

| Activity              | Purpose                       |
| --------------------- | ----------------------------- |
| DNS Analysis          | Domain resolution review      |
| HTTP Analysis         | Web communication inspection  |
| Conversation Analysis | Host communication mapping    |
| IOC Extraction        | Network indicators collection |

### Outcome

Successfully analyzed DNS requests, HTTP traffic, and communication flows present within the packet capture.

---

## 🧬 PE Studio

### Purpose

Static examination of executable files without execution.

### Investigation Tasks

| Activity            | Purpose                    |
| ------------------- | -------------------------- |
| PE Structure Review | Binary assessment          |
| Import Analysis     | API inspection             |
| Entropy Review      | Packed file detection      |
| Metadata Analysis   | Executable characteristics |

### Outcome

Generated risk indicators and structural information about the analyzed executable.

---

## 🔑 CertUtil

### Purpose

Used to generate cryptographic hashes for integrity verification.

### Commands Used

```powershell
certutil -hashfile Wireshark.exe MD5
certutil -hashfile Wireshark.exe SHA256
```

### Outcome

Verified file integrity and generated unique identifiers for evidence tracking.

---

## 🎯 YARA

### Purpose

Develop custom detection signatures.

### Investigation Tasks

| Activity          | Purpose                |
| ----------------- | ---------------------- |
| Rule Development  | Malware identification |
| Signature Testing | Rule validation        |
| Pattern Matching  | IOC-based detection    |

### Outcome

Successfully created and validated custom YARA detection rules.

---

## 📊 Tool Workflow

```text
Evidence Collection
        │
        ▼
Memory Analysis (Volatility)
        │
        ▼
Disk Analysis (Autopsy)
        │
        ▼
Network Analysis (Wireshark)
        │
        ▼
Static Analysis (PE Studio)
        │
        ▼
Hash Verification (CertUtil)
        │
        ▼
Detection Engineering (YARA)
        │
        ▼
IOC Documentation
```

---

## 🎓 Skills Gained Through Tool Usage

| Domain                | Practical Experience          |
| --------------------- | ----------------------------- |
| Memory Forensics      | Volatility workflows          |
| Disk Forensics        | Artifact analysis             |
| Network Security      | Packet investigation          |
| Malware Analysis      | Static assessment             |
| Detection Engineering | YARA development              |
| Incident Response     | Evidence-driven investigation |
| Documentation         | Professional reporting        |

---

## Final Notes

The tools documented in this project represent a foundational DFIR toolkit commonly used by forensic analysts, incident responders, SOC analysts, and malware researchers.

Hands-on experience with these technologies provided practical exposure to real-world forensic investigation workflows and evidence-driven cybersecurity analysis.
