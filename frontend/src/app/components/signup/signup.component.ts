import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Custom validator: confirm password must match password
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm: FormGroup;
  isLoading     = false;
  errorMessage  = '';
  successMessage = '';
  showPassword  = false;
  showConfirm   = false;

  roles = [
    { value: 'marketing_team',   label: 'Marketing Team' },
    { value: 'content_creator',  label: 'Content Creator' },
    { value: 'executive',        label: 'Executive' },
    { value: 'it_support',       label: 'IT Support' }
  ];

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      full_name:       ['', [Validators.required, Validators.minLength(3)]],
      email:           ['', [Validators.required, Validators.email]],
      role:            ['marketing_team', Validators.required],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading     = true;
    this.errorMessage  = '';
    this.successMessage = '';

    const { full_name, email, password, role } = this.signupForm.value;

    this.auth.register({ full_name, email, password, role }).subscribe({
      next: () => {
        this.isLoading      = false;
        this.successMessage = 'Account created! Redirecting...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.isLoading    = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
