import "dart:convert";
import "dart:typed_data";

import "package:crypto/crypto.dart";

class MediaService {
  String buildSha256WithMetadata({
    required Uint8List bytes,
    required DateTime timestamp,
    required double lat,
    required double lng,
  }) {
    // Produces tamper-evident hash with media bytes + timestamp + GPS.
    final encodedBytes = base64Encode(bytes);
    final material = "$encodedBytes|${timestamp.toIso8601String()}|$lat,$lng";
    return sha256.convert(utf8.encode(material)).toString();
  }
}
