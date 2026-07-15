$ErrorActionPreference = 'Stop'

$login = Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/auth/login' -Body (ConvertTo-Json @{email='officer@sdrf.local';password='password123'}) -ContentType 'application/json'
$token = $login.token
Write-Output "TOKEN: $token"

Write-Output '--- Create volunteer ---'
$r = Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/volunteers' -Headers @{ Authorization = "Bearer $token" } -Body (ConvertTo-Json @{name='Smoke PS2'; phone='+919900112234'; lat=28.5; lng=77.2; capabilities='SAR'; department='Police'}) -ContentType 'application/json'
$r | ConvertTo-Json -Depth 5

Write-Output '--- Get volunteers ---'
Invoke-RestMethod -Method Get -Uri 'http://localhost:4001/volunteers' -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5

Write-Output '--- Create resource ---'
Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/resources' -Headers @{ Authorization = "Bearer $token" } -Body (ConvertTo-Json @{name='Smoke Pump'; category='Pump'; department='Fire Brigade'; quantity=3; lat=28.6; lng=77.2}) -ContentType 'application/json' | ConvertTo-Json -Depth 5

Write-Output '--- Get resources ---'
Invoke-RestMethod -Method Get -Uri 'http://localhost:4001/resources' -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5

Write-Output '--- Create incident (address only) ---'
Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/incidents' -Headers @{ Authorization = "Bearer $token" } -Body (ConvertTo-Json @{title='Addr Test'; disasterType='Flood'; address='Near Market, Shimla'; agencyAssigned='SDRF'}) -ContentType 'application/json' | ConvertTo-Json -Depth 5

Write-Output '--- Get incidents ---'
Invoke-RestMethod -Method Get -Uri 'http://localhost:4001/incidents' -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5

Write-Output '--- Create task with custom agency ---'
Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/tasks' -Headers @{ Authorization = "Bearer $token" } -Body (ConvertTo-Json @{incidentId=1; title='Custom agency task'; details='Coordinate with local group'; assignedAgency='Community Group'; status='New'}) -ContentType 'application/json' | ConvertTo-Json -Depth 5

Write-Output '--- Get tasks ---'
Invoke-RestMethod -Method Get -Uri 'http://localhost:4001/tasks' -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5
