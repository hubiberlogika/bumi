import PartnerDirectoryWorkspace from "@/features/master-data/components/PartnerDirectoryWorkspace";
import { partnerRecords, partnerRequirements, partnerStats } from "@/features/master-data/data/partnerData";

export default function PartnersPage() {
  return (
    <PartnerDirectoryWorkspace stats={partnerStats} records={partnerRecords} requirements={partnerRequirements} />
  );
}
