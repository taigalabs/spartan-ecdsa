import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import CryptoAssetAtstList from "@/components/crypto_asset_atst_list/CryptoAssetAtstList";
import GlobalErrorDialog from "@/components/global_error_dialog/GlobalErrorDialog";
import GroupMemberAtstList from "@/components/group_member_atst_list/GroupMemberAtstList";

const AtstGroupPage: React.FC<AtstGroupPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AttestationsMainInner>
                <GroupMemberAtstList atst_group_id={atst_group_id} />
              </AttestationsMainInner>
            </AttestationsMain>
          </Attestations>
        </Suspense>
      </AttestationsDefaultBody>
    </DefaultLayout>
  );
};

export default AtstGroupPage;

interface AtstGroupPageProps {
  params: {
    atst_group_id: string;
  };
}
