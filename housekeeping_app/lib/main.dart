import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const GrandHorizonHousekeepingApp());
}

class GrandHorizonHousekeepingApp extends StatelessWidget {
  const GrandHorizonHousekeepingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Horizon Housekeeping',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFEF3F09),
          primary: const Color(0xFFEF3F09),
          surface: const Color(0xFFF8FAFC),
        ),
        fontFamily: 'Plus Jakarta Sans',
      ),
      home: const HousekeepingHomeScreen(),
    );
  }
}

class HousekeepingHomeScreen extends StatefulWidget {
  const HousekeepingHomeScreen({super.key});

  @override
  State<HousekeepingHomeScreen> createState() => _HousekeepingHomeScreenState();
}

class _HousekeepingHomeScreenState extends State<HousekeepingHomeScreen> {
  String _selectedFilter = 'ALL';
  int _selectedFloor = 0; // 0 = All floors

  // Demo Room Inventory List
  List<Map<String, dynamic>> _rooms = [
    {'id': '1', 'number': 'Room 101', 'floor': 1, 'type': 'Standard Double', 'status': 'DIRTY', 'lastCleaned': 'Yesterday'},
    {'id': '2', 'number': 'Room 102', 'floor': 1, 'type': 'Standard Double', 'status': 'CLEAN', 'lastCleaned': '2 hours ago'},
    {'id': '3', 'number': 'Room 201', 'floor': 2, 'type': 'Deluxe King', 'status': 'DIRTY', 'lastCleaned': 'Yesterday'},
    {'id': '4', 'number': 'Room 301', 'floor': 3, 'type': 'Executive Suite', 'status': 'INSPECTED', 'lastCleaned': '30 mins ago'},
    {'id': '5', 'number': 'Room 402', 'floor': 4, 'type': 'Executive Suite', 'status': 'OUT_OF_ORDER', 'lastCleaned': 'Maintenance'},
  ];

  Color _getStatusColor(String status) {
    switch (status) {
      case 'CLEAN': return const Color(0xFF22C55E);
      case 'DIRTY': return const Color(0xFFEAB308);
      case 'INSPECTED': return const Color(0xFF3B82F6);
      case 'OUT_OF_ORDER': return const Color(0xFFEF4444);
      default: return Colors.grey;
    }
  }

  void _openStatusUpdateSheet(Map<String, dynamic> room) {
    String newStatus = room['status'];
    final TextEditingController notesController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20, right: 20, top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossStart,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Update ${room['number']}',
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('Select Room Status:', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: ['CLEAN', 'DIRTY', 'INSPECTED', 'OUT_OF_ORDER'].map((status) {
                      final isSelected = newStatus == status;
                      return ChoiceChip(
                        label: Text(status),
                        selected: isSelected,
                        selectedColor: _getStatusColor(status).withOpacity(0.2),
                        onSelected: (selected) {
                          if (selected) setSheetState(() => newStatus = status);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: notesController,
                    decoration: InputDecoration(
                      labelText: 'Maintenance / Cleaning Notes',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      prefixIcon: const Icon(Icons.edit_note),
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Photo attached successfully')),
                      );
                    },
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Attach Maintenance Photo'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        room['status'] = newStatus;
                      });
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${room['number']} updated to $newStatus')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEF3F09),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Save Status Change', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredRooms = _rooms.where((room) {
      final matchesStatus = _selectedFilter == 'ALL' || room['status'] == _selectedFilter;
      final matchesFloor = _selectedFloor == 0 || room['floor'] == _selectedFloor;
      return matchesStatus && matchesFloor;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Grand Horizon', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('Housekeeping Mobile App', style: TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Filter Chips & Floor Dropdown
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: Colors.white,
            child: Row(
              children: [
                DropdownButton<int>(
                  value: _selectedFloor,
                  items: const [
                    DropdownMenuItem(value: 0, child: Text('All Floors')),
                    DropdownMenuItem(value: 1, child: Text('Floor 1')),
                    DropdownMenuItem(value: 2, child: Text('Floor 2')),
                    DropdownMenuItem(value: 3, child: Text('Floor 3')),
                    DropdownMenuItem(value: 4, child: Text('Floor 4')),
                  ],
                  onChanged: (val) => setState(() => _selectedFloor = val ?? 0),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: ['ALL', 'DIRTY', 'CLEAN', 'INSPECTED', 'OUT_OF_ORDER'].map((status) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(status, style: const TextStyle(fontSize: 11)),
                            selected: _selectedFilter == status,
                            onSelected: (selected) {
                              if (selected) setState(() => _selectedFilter = status);
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Room Grid List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filteredRooms.length,
              itemBuilder: (context, index) {
                final room = filteredRooms[index];
                final statusColor = _getStatusColor(room['status']);

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 1,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    title: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(room['number'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            room['status'],
                            style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ),
                      ],
                    ),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 6),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${room['type']} • Floor ${room['floor']}', style: const TextStyle(fontSize: 13)),
                          Text('Last: ${room['lastCleaned']}', style: TextStyle(fontSize: 11, color: Colors.grey[600])),
                        ],
                      ),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => _openStatusUpdateSheet(room),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
