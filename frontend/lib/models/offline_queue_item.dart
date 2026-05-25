class OfflineQueueItem {
  final String entityType;
  final String? entityId;
  final String operation;
  final Map<String, dynamic> payload;

  OfflineQueueItem({
    required this.entityType,
    required this.entityId,
    required this.operation,
    required this.payload,
  });

  Map<String, dynamic> toJson() {
    return {
      "entityType": entityType,
      "entityId": entityId,
      "operation": operation,
      "payload": payload,
    };
  }
}
