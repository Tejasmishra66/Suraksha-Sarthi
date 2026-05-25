import "package:flutter/material.dart";

class AgencyDropdown extends StatelessWidget {
  const AgencyDropdown({
    required this.value,
    required this.onChanged,
    super.key,
  });

  final String value;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) {
    // Reusable assignment selector for tasks/incidents.
    const agencies = ["SDRF", "Police", "Medical", "Utility", "Connectivity"];
    return DropdownButtonFormField<String>(
      value: value.isEmpty ? null : value,
      decoration: const InputDecoration(labelText: "Assign Agency", border: OutlineInputBorder()),
      items: agencies
          .map((agency) => DropdownMenuItem<String>(value: agency, child: Text(agency)))
          .toList(),
      onChanged: onChanged,
    );
  }
}
