# EnergyCommunities Project

## Overview
**EnergyCommunities** is a full-stack application designed to support the management and optimization of **energy communities**.  
The system enables a community manager to analyze energy consumption behaviors, simulate alternative configurations, and identify strategies to maximize shared energy usage.

The project integrates **frontend visualization**, **backend logic**, and **advanced reasoning techniques** based on **Answer Set Programming (ASP)** to generate optimization scenarios and recommendations.

---

## Technologies Used

### Frontend
- **Angular**
- **TypeScript**
- Interactive graphical user interface for:
    - Member management
    - Data visualization
    - Simulation comparison

### Backend
- **Java Spring Boot**
- **Clingo / Answer Set Programming (ASP)**
- REST APIs for data processing and reasoning tasks

### Infrastructure
- **Docker**
- **Docker Compose**

---

## Application Features

### Energy Community Management
The manager can:
- Create and manage one or more energy communities
- Add members by:
    - Uploading a **CSV file**
    - Manually inserting data via the graphical interface
- Define average consumption profiles for each member

### Analysis and Optimization
Using **ASP reasoning**, the application can:
- Generate multiple **simulation scenarios**
- Analyze different community configurations
- Suggest improvements such as:
    - Purchasing energy storage batteries
    - Optimizing battery usage strategies
    - Adding or removing members to improve performance
    - Maximizing shared energy within the community

### Results and Comparison
The system allows the manager to:
- Visualize simulation results
- Save analysis outcomes
- Compare different scenarios
- Identify the configuration that yields the best overall performance

---

## Methodology

The project was developed using the **Scrum methodology**.

All related materials are available in the `docs/` directory, including:
- Sprint planning documents
- Sprint reviews
- Retrospectives
- PDF files summarizing:
    - Implemented features
    - Design decisions
    - Project evolution over time

---

## Usage

### Start the application
To start the entire system (database, backend, and frontend):

```bash
docker-compose up --build
```

## Project Structure
```text

.  
├── energy-communities-ng/       # Angular + TypeScript frontend application.   
├── energycommunities/           # Spring Boot backend with ASP (Clingo).   
├── docs/                        # Scrum documentation.
└── docker-compose.yml           # Docker Compose orchestration.  
```
## Authors
Project developed as part of an academic / research activity using agile methodologies.


```text
Unical - University of  Calabria 
DEMACS

Rudi Giuseppe
Cristiano Francesco 
Filocamo Francesco
Ielpa Eugenio
Trocini Pierluigi  
```

## Project Status

This repository contains the final archived version, a university project developed for academic purposes.

The project is not currently maintained, and the repository has been archived to preserve the final submitted version. The code remains publicly available as part of the project documentation and portfolio. Future work may restart from this codebase if the project is extended or redesigned.
