//
//  SafariExtensionViewController.swift
//  QCLean Extension
//
//  Created by Qing-Cheng Li on 2019/10/7.
//  Copyright © 2019 Qing-Cheng Li. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
