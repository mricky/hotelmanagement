<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use App\Services\InventoryLockService;

class PaymentWebhookTest extends TestCase
{
    /** @test */
    public function it_rejects_webhook_with_invalid_signature()
    {
        $payload = [
            'order_id' => 'GHB-2026-X91A',
            'status_code' => '200',
            'gross_amount' => '1250000.00',
            'signature_key' => 'invalid_signature_hash',
            'transaction_status' => 'settlement'
        ];

        $response = $this->postJson('/api/webhooks/midtrans', $payload);

        $response->assertStatus(403);
        $response->assertJson(['message' => 'Invalid signature']);
    }

    /** @test */
    public function it_processes_successful_settlement_webhook()
    {
        $serverKey = config('services.midtrans.server_key', 'test_server_key');
        $orderId = 'GHB-2026-X91B';
        $statusCode = '200';
        $grossAmount = '1250000.00';
        
        $validSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        // Mock booking in database
        DB::table('bookings')->insert([
            'id' => \Illuminate\Support\Str::uuid(),
            'property_id' => \Illuminate\Support\Str::uuid(),
            'room_type_id' => \Illuminate\Support\Str::uuid(),
            'booking_code' => $orderId,
            'guest_name' => 'John Test',
            'guest_email' => 'john@test.com',
            'guest_phone' => '08123456789',
            'check_in_date' => '2026-09-01',
            'check_out_date' => '2026-09-03',
            'base_price_per_night' => 625000.00,
            'total_amount' => 1250000.00,
            'status' => 'PENDING_PAYMENT',
            'payment_status' => 'UNPAID',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $payload = [
            'order_id' => $orderId,
            'status_code' => $statusCode,
            'gross_amount' => $grossAmount,
            'signature_key' => $validSignature,
            'transaction_status' => 'settlement',
            'fraud_status' => 'accept'
        ];

        $response = $this->postJson('/api/webhooks/midtrans', $payload);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);

        // Assert booking updated to CONFIRMED and PAID
        $this->assertDatabaseHas('bookings', [
            'booking_code' => $orderId,
            'status' => 'CONFIRMED',
            'payment_status' => 'PAID'
        ]);
    }
}
