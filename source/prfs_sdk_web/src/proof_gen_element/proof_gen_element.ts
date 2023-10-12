import { ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { handleChildMessage } from "./handle_child_msg";
import { sendMsgToChild } from "../msg";
import { ProofGenOptions } from "../element_options";
import { Msg } from "../msg";

export const PROOF_GEN_IFRAME_ID = "prfs-sdk-iframe";
export const PLACEHOLDER_ID = "prfs-sdk-placeholder";
export const MSG_SPAN_ID = "prfs-sdk-msg";
export const PORTAL_ID = "prfs-sdk-portal";
const CONTAINER_ID = "prfs-sdk-container";

const singleton: ProofGenElementSingleton = {
  msgEventListener: undefined,
};

class ProofGenElement {
  options: ProofGenOptions;
  public state: ProofGenElementState;

  constructor(options: ProofGenOptions) {
    this.options = options;
    this.state = {
      iframe: undefined,
      driverVersion: undefined,
    };
  }

  async mount(): Promise<HTMLIFrameElement | null> {
    const { options } = this;
    console.log("Mounting sdk, options: %o, ", options);

    const { sdkEndpoint } = options;

    if (singleton.msgEventListener) {
      console.warn("sdk is already mounted");
      return null;
    }

    if (!sdkEndpoint) {
      console.error("SDK endpoint is not defined");
      return null;
    }

    const containerId = CONTAINER_ID;

    try {
      await fetch(`${sdkEndpoint}/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });
    } catch (err) {
      throw new Error("sdk endpoint is not responding");
    }

    // await new Promise(async resolve => {
    const container = document.createElement("div");
    container.id = containerId;
    container.style.width = "0px";
    container.style.height = "0px";

    const iframe = document.createElement("iframe");
    iframe.id = PROOF_GEN_IFRAME_ID;
    iframe.src = `${sdkEndpoint}/proof_gen?proofTypeId=${options.proofTypeId}`;
    iframe.allow = "cross-origin-isolated";
    iframe.style.border = "none";
    iframe.style.display = "none";
    this.state.iframe = iframe;

    container.appendChild(iframe);
    document.body.appendChild(container);

    if (iframe.contentWindow) {
      iframe.contentWindow.onerror = () => {
        console.log(55555555);
      };
    }

    if (singleton.msgEventListener) {
      console.warn("Remove already registered Prfs sdk message event listener");
      window.removeEventListener("message", singleton.msgEventListener);
    }

    console.log("listening child messages");
    const msgEventListener = await handleChildMessage(options);

    singleton.msgEventListener = msgEventListener;
    // });

    const { circuit_driver_id, driver_properties } = options;

    const driverVersion = await sendMsgToChild(
      new Msg("LOAD_DRIVER", {
        circuit_driver_id,
        driver_properties,
      }),
      iframe
    );

    console.log("driver version", driverVersion);
    this.state.driverVersion = driverVersion;

    return this.state.iframe!;
  }

  async createProof(args: Record<string, any>): Promise<ProveReceipt> {
    if (!this.state.iframe) {
      throw new Error("iframe is not created");
    }

    try {
      const proofResp = await sendMsgToChild(new Msg("CREATE_PROOF", args), this.state.iframe);
      return proofResp;
    } catch (err) {
      throw new Error(`Error creating proof: ${err}`);
    }
  }
}

export default ProofGenElement;

export interface ProofGenElementState {
  iframe: HTMLIFrameElement | undefined;
  driverVersion: string | undefined;
}

export interface ProofGenElementSingleton {
  msgEventListener: any;
}
