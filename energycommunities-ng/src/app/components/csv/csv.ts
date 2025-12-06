import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../model/User';
import { PlanDetail } from '../../model/plan/PlanDetail';
import Papa from 'papaparse';
import { NewMember } from '../../model/member/NewMember';
import { NewProfile } from '../../model/member/NewProfile';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { ChartOptions } from 'chart.js';
import { MemberDetail } from '../../model/member/MemberDetail';
import { Profile } from '../../model/member/Profile';
import { OngoingAnalysis } from '../../model/analysis/OngoingAnalysis';

@Component({
  selector: 'app-csv',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent],
  templateUrl: './csv.html',
  styleUrls: ['../welcome/welcome.css', './csv.css'],
})
export class Csv implements OnInit {
  currentUser: User | null = null;

  constructor(private planService: PlanService, private router: Router, private authService: AuthService) { }

  ownerId: number = 0;
  errorMessage = '';
  successMessage = '';
  csvData: string[][] = [];
  profiles: any[] = [];
  selectedFile: File | null = null;

  owner_plan: PlanDetail | null = null;
  new_members: NewMember[] = [];

  member_modal_visible: boolean = false;
  new_member_modal_item: NewMember | null | undefined = null;
  member_modal_item: MemberDetail | null | undefined = null;

  ongoing_analysis_modal_visible: boolean = false;
  ongoing_analysis_modal_item: NewMember | null | undefined = null;
  ongoing_analysis_modal_list: OngoingAnalysis[] | null = []

  confirmation_modal_visible: boolean = false;
  dashboard_redirect: boolean = false;

  chartLabels: string[] = Array.from({ length: 24 }, (_, i) => `${i}`);

  chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour (0-23)' } },
      y: { title: { display: true, text: 'Energy (kWh)' }, beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  ngOnInit() {

    this.authService.user$.subscribe(user => this.currentUser = user);

    if (this.currentUser != null) {
      this.ownerId = this.currentUser.id;
      this.planService.get_full_plan(this.currentUser.plan_id).subscribe({
        next: response => { this.owner_plan = response },
        error: error => {
          this.owner_plan = {
            id: 0,
            members: []
          }
          console.warn(error)
        }
      })
    }

  }

  expectedHeader = [
    'id', 'full_name', 'email', 'category',
    ...Array.from({ length: 24 }, (_, i) => `t${i}`)
  ];

  onFileSelected(event: Event): void {
    this.new_members = []

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn('Nessun file selezionato');
      return;
    }
    const file = input.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (result) => {
        let current_id = 0
        result.data.forEach((row: any) => {
          let new_m = this.new_members.find(m => row['email'].toString() === m.email && row['full_name'].toString() === m.fullName)

          console.log(new_m)

          if (new_m === undefined || new_m === null) {
            new_m = {
              id: current_id,
              fullName: row['full_name']?.toString(),
              email: row['email']?.toString(),
              memberType: null,
              profiles: [],
              plan_id: this.owner_plan!.id,

              any_conflicts: null
            }

            this.new_members.push(new_m)
            current_id++;
          }


          let new_profile: NewProfile = {
            id: null,
            profileType: row.category.toString().toUpperCase(),
            graph: [...Array(24)].map((_, i) => Number(row[`t${i}`] || 0))
          }

          new_m.profiles.push(new_profile)


          return new_m
        })
        this.check_conflicts()
      }
    })
    console.log(this.new_members)
  }

  check_conflicts() {
    if (this.new_members.length <= 0) return;

    for (let member of this.new_members) {
      if (this.owner_plan!.members.find(m => m.email === member.email && m.fullName === member.fullName))
        member.any_conflicts = 'MEMBER_ALREADY_PRESENT'
      else if (this.owner_plan!.members.find(m => m.email === member.email && m.fullName != member.fullName))
        member.any_conflicts = 'EMAIL_ALREADY_USED'
      else if (this.new_members.find(m => m.id != member.id && m.email === member.email && m.fullName != member.fullName))
        member.any_conflicts = 'EMAIL_ALREADY_USED'
      else if (this.owner_plan!.members.find(m => m.email === member.email && m.fullName === member.fullName && m.ongoingAnalysis!.length > 0))
        member.any_conflicts = 'ONGOING_ANALYSIS'
      else
        member.any_conflicts = 'NO_CONFLICTS'
    }

    console.log(this.new_members)
    console.log(this.owner_plan!.members)
  }

  downloadTemplate(): void {
    const csvContent = `id,full_name,email,category,${Array.from({ length: 24 }, (_, i) => `t${i}`).join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  saveCsv(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'No file selected';
      return;
    }

    this.planService.uploadCsv(this.selectedFile, this.ownerId).subscribe({
      next: (res) => {
        this.successMessage = res;
        console.log(this.successMessage);
        this.authService.setUserField('plan_id', Number(this.successMessage));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Error uploading file: ' + (err.error || err.message);
      }
    });
  }

  change_email(member: NewMember, new_email: string) {
    if (!member) return;

    member.email = new_email;
    this.check_conflicts();
  }

  action_column_status(): boolean {
    return this.new_members.find(m => m.any_conflicts != 'NO_CONFLICTS') ? true : false
  }

  open_modal(member: NewMember) {
    this.member_modal_visible = true;
    this.new_member_modal_item = member;
    this.member_modal_item = this.owner_plan?.members.find(m => m.email === member.email && m.fullName === member.fullName)
  }

  close_modal() {
    this.member_modal_visible = false;
    this.new_member_modal_item = null;
    this.member_modal_item = null;
  }

  keep_new_profiles(new_member: NewMember | null | undefined) {
    let member_to_delete = this.owner_plan?.members.find(m => m.email === new_member?.email && m.fullName === new_member.fullName)
    // console.log("member_id: " + member_to_delete?.id! + " owner_id: " + this.currentUser?.id!)
    this.planService.deleteMemberFromPlan(member_to_delete?.id!, this.currentUser?.id!).subscribe(() => {
      alert(`Member: ${member_to_delete!.fullName} deleted from your plan. It will be updated soon!`);
      this.planService.get_full_plan(this.currentUser!.plan_id).subscribe(response => { this.owner_plan = response })

      new_member!.any_conflicts = 'NO_CONFLICTS'

      this.close_modal();
    })
  }

  keep_previous_profiles(member_to_delete: NewMember | null | undefined) {
    this.new_members = this.new_members.filter(m => !(m.fullName === member_to_delete?.fullName && m.email === member_to_delete.email))

    alert(`Member: ${member_to_delete!.fullName} deleted!`)

    this.close_modal();
  }

  open_ongoing_analysis_modal(member: NewMember) {
    this.ongoing_analysis_modal_visible = true
    this.ongoing_analysis_modal_item = member

    this.ongoing_analysis_modal_list = this.owner_plan?.members.find(m => m.email == member.email && m.fullName === member.email)?.ongoingAnalysis!
  }

  close_ongoing_analysis_modal() {
    this.ongoing_analysis_modal_visible = false
    this.ongoing_analysis_modal_item = null
    this.ongoing_analysis_modal_list = []
  }

  ongoing_analysis_delete_member(member_to_delete: NewMember | null | undefined) {
    this.new_members = this.new_members.filter(m => !(m.fullName === member_to_delete?.fullName && m.email === member_to_delete.email))

    alert(`Member: ${member_to_delete!.fullName} deleted!`)

    this.close_ongoing_analysis_modal();
  }

  save_new_members() {
    for (let member of this.new_members) {
      let member_detail: MemberDetail = {
        id: 0,
        fullName: member.fullName,
        email: member.email,
        memberType: 'TBD',
        profiles: member.profiles as Profile[],
        ongoingAnalysis: [],
        plan_id: this.owner_plan?.id!
      }

      this.planService.add_new_member(member_detail, this.ownerId).subscribe(response => {
        console.log(response)
        this.authService.set_plan(response.plan_id)

      })
    }

    alert("All members uploaded!")
    this.router.navigate(['/dashboard'], { onSameUrlNavigation: 'reload' }).then(() => window.location.reload());
  }

}
