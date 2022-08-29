<?php

namespace Modules\Admin\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TestNotification extends Notification
{
    public function __construct()
    {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toMail($notifiable): MailMessage
    {
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Test notification',
            'description' => 'This is a test notification',
        ];
    }
}
