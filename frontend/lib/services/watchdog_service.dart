import "dart:async";

import "api_service.dart";

class WatchdogService {
  WatchdogService(this._apiService, this._agency);

  final ApiService _apiService;
  final String _agency;
  Timer? _timer;

  void start() {
    // Sends heartbeat every 5 minutes as watchdog signal.
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(minutes: 5), (_) {
      _apiService.heartbeat(_agency);
    });
  }

  void stop() {
    _timer?.cancel();
    _timer = null;
  }
}
