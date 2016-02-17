class JobsController < ApplicationController
  before_action :authenticate_user!, only: [:index, :destroy]
  before_action :job, only: [:show, :progress, :validation, :download_validation]

  def index
    @jobs = Job.find_my_job(current_user).page(params[:page])
  end

  def show
    if @job.is_terminated?
      redirect_to validation_job_path(@job)
    else
      progress_steps
    end
  end

  def progress
    progress_steps
    render json: @datas
  end

  def validation
    @default_view = params[:default_view] ? params[:default_view].to_sym : :files
    @validation_report = ValidationService.new(@job.validation_report, params[:q])
    if @default_view == :files
      @elements_to_paginate = @filenames = Kaminari.paginate_array(@validation_report.filenames).page(params[:page]).per(ENV['NUMBER_RESULTS_PER_PAGE'])
      @lines = @validation_report.lines
      @total_elements = @validation_report.filenames.count
    else
      @elements_to_paginate = @lines = Kaminari.paginate_array(@validation_report.lines).page(params[:page]).per(ENV['NUMBER_RESULTS_PER_PAGE'])
      @filenames = @validation_report.filenames
      @total_elements = @validation_report.lines.count
    end
    @tests = @validation_report.tests
    @report, @lines_ok, @lines_nok = @job.action_report
    @search_for = @validation_report.search_for
  end

  def download_validation
    # TODO: Export in CSV format
    send_data @job.validation_report, filename: "#{@job.name}-#{@job.id}.json", type: 'application/json'
  end

  def cancel
    job = Job.find_with_id_and_user(params[:id], (user_signed_in? ? current_user.id : nil))
    job.ievkit_cancel_or_delete(:cancel)
    job.destroy
    redirect_to root_path
  end

  def destroy
    job = Job.find_by(id: params[:id], user: current_user)
    job.ievkit_cancel_or_delete(:delete)
    job.destroy
    redirect_to root_path
  end

  private

  def job
    @job = Job.find(params[:id])
  end

  def progress_steps
    @datas = @job.is_terminated? ? { redirect: validation_job_path } : @job.progress_steps
  end
end