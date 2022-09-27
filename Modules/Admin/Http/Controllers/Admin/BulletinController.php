<?php

namespace Modules\Admin\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use League\CommonMark\CommonMarkConverter;
use League\CommonMark\GithubFlavoredMarkdownConverter;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class BulletinController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Bulletin::class, 'bulletin');
    }

    public function index(Request $request)
    {
        $payload = [
            'bulletins' => QueryBuilder::for(Bulletin::class)
                ->with('user')
                ->latest()
                ->allowedFilters(['title', 'excerpt', 'markdown', AllowedFilter::callback('status', function (Builder $query, $value) {
                    switch ($value) {
                        case 'published':
                            $query->whereNotNull('published_at');
                            return;
                        case 'draft':
                            if (auth()->user()->can('admin.admin.bulletins.edit')) {
                                $query->whereNull('published_at');
                            }
                            return;
                        case 'all':
                            if (!auth()->user()->can('admin.admin.bulletins.edit')) {
                                $query->whereNotNull('published_at');
                            }
                            return;
                    }
                })->default('all')
                ])
                ->allowedSorts(['created_at', 'updated_at', 'id'])
                ->paginate()
                ->appends(request()->query())
        ];

        if ($request->wantsJson()) {
            return response()->json($payload);
        }

        return Inertia::render('Admin/Bulletin/Index', $payload);
    }

    public function edit(Request $request, ?Bulletin $bulletin)
    {
        return Inertia::render('Admin/Bulletin/Create', [
            'bulletin' => $bulletin,
        ]);
    }

    public function show(Request $request, Bulletin $bulletin)
    {
        $bulletin->load('user');

        return Inertia::render('Admin/Bulletin/Show', [
            'bulletin' => $bulletin,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Bulletin/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|integer|exists:bulletins,id',
            'title' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:255'],
            'markdown' => ['required', 'string'],
        ]);

        $converter = new GithubFlavoredMarkdownConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);

        $html = $converter->convert($validated['markdown'])->getContent();

        if ($request->input('id')) {
            $bulletin = Bulletin::find($validated['id']);

            $bulletin->update([
                'title' => $request->input('title', 'untitled'),
                'excerpt' => $request->input('excerpt', mb_substr(strip_tags($html), 0, 255)),
                'markdown' => $validated['markdown'],
                'html' => $html,
            ]);

        } else {
            $bulletin = Bulletin::create([
                'user_id' => auth()->id(),
                'title' => $request->input('title', 'untitled'),
                'excerpt' => $request->input('excerpt', mb_substr(strip_tags($html), 0, 255)),
                'markdown' => $validated['markdown'],
                'html' => $html,
                'published_at' => null,
            ]);
        }

        return redirect()->route('admin.admin.bulletins.edit', [
            'bulletin' => $bulletin->id,
        ]);
    }

    public function uploadImage(Request $request, Bulletin $bulletin)
    {
        $request->validate([
            'images' => ['required'],
            'image.*' => ['image'],
        ]);

        $media = collect($request->file('images'))->map(function ($image) use ($bulletin) {
            return $bulletin->addMedia($image)->toMediaCollection('images');
        });

        return response()->json($media);
    }

    public function destroy(Request $request, Bulletin $bulletin)
    {
        $bulletin->delete();

        return redirect()->route('admin.admin.bulletins.index');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:bulletins,id'],
        ]);

        Bulletin::destroy($request->input('ids'));

        return redirect()->route('admin.admin.bulletins.index');
    }

    public function publish(Request $request, Bulletin $bulletin)
    {
        $bulletin->update([
            'published_at' => now(),
        ]);

        return redirect()->route('admin.admin.bulletins.edit', [
            'bulletin' => $bulletin->id,
        ]);
    }
}
