import "package:flutter/material.dart";

import "screens/login_screen.dart";

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SdrfHelpingHandsApp());
}

class SdrfHelpingHandsApp extends StatelessWidget {
  const SdrfHelpingHandsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "SDRF Helping Hands",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF005A9C)),
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}
