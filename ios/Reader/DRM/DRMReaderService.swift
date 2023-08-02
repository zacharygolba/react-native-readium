import Combine
import Foundation
import R2Shared

protocol DRMReaderService {
  /// Returns the `ContentProtection` which will be provided to the `Streamer`, to unlock
  /// publications.
  var contentProtection: ContentProtection? { get }
}
