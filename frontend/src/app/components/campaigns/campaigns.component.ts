import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  campaigns: any[] = [];
  loading = true;
  error = '';
  selectedCampaign: any = null;

  constructor(private campaignSvc: CampaignService) {}

  ngOnInit(): void {
    this.campaignSvc.getAll().subscribe({
      next: (res) => { this.campaigns = res.data; this.loading = false; },
      error: () => { this.error = 'Failed to load campaigns.'; this.loading = false; }
    });
  }

  viewCampaign(id: number): void {
    this.campaignSvc.getOne(id).subscribe({
      next: (res) => { this.selectedCampaign = res.data; },
      error: () => {}
    });
  }

  closeDetail(): void { this.selectedCampaign = null; }

  formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  getBudgetUsed(campaign: any): number {
    if (!campaign.budget) return 0;
    return Math.min(100, Math.round((campaign.total_engagement / 1000) * 2));
  }
}
