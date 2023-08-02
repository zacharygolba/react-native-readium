#if LCP

  import Combine
  import Foundation
  import R2LCPClient
  import R2Shared
  import ReadiumLCP
  import UIKit

  class LCPReaderService: DRMReaderService {
    lazy var contentProtection: ContentProtection? = self.lcpService.contentProtection()

    private var lcpService = LCPService(client: LCPClient())
    private var passphrase: String?

    func updatePassphrase(_ passphrase: String) {
      if passphrase != self.passphrase {
        self.contentProtection = self.lcpService.contentProtection(
          with: LCPPassphraseAuthentication(passphrase))
      }
    }
  }

  /// Facade to the private ReadiumLCP.framework.
  class LCPClient: ReadiumLCP.LCPClient {
    func createContext(jsonLicense: String, hashedPassphrase: String, pemCrl: String) throws
      -> LCPClientContext
    {
      try R2LCPClient.createContext(
        jsonLicense: jsonLicense, hashedPassphrase: hashedPassphrase, pemCrl: pemCrl)
    }

    func decrypt(data: Data, using context: LCPClientContext) -> Data? {
      R2LCPClient.decrypt(data: data, using: context as! DRMContext)
    }

    func findOneValidPassphrase(jsonLicense: String, hashedPassphrases: [String]) -> String? {
      R2LCPClient.findOneValidPassphrase(
        jsonLicense: jsonLicense, hashedPassphrases: hashedPassphrases)
    }
  }

#endif
